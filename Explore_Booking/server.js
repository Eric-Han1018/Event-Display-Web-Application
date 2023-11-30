'use strict';
const log = console.log;
const env = process.env.NODE_ENV

// Server Stuff
const path = require('path')

// Test user
const USE_TEST_USER = env !== 'production' && process.env.TEST_USER_ON 
const TEST_USER_ID = '61a51e32420d5d2b3c25fc74' 
const TEST_USER_NAME = 'test'
const TEST_USER_IDENTITY = 'user'
const TEST_EVENT = '61ac693fe8e7fdea92743771'

// Express
const express = require('express')
const app = express();

// enable CORS
const cors = require('cors');
if (env !== 'production') { app.use(cors()) }

// body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit:'50mb', extended: true }));

// Mongo and Mongoose
const { ObjectID } = require('mongodb')
const { mongoose } = require('./db/mongoose');
const { Booth } = require('./models/booth')
const { User } = require('./models/user')
const { Exhibition } = require('./models/exhibition')

const session = require("express-session");
const MongoStore = require('connect-mongo')

function isMongoError(error) { // checks for first error returned by promise rejection if Mongo database suddently disconnects
    return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
}

const cloudinary = require("cloudinary")
cloudinary.config({ 
    cloud_name: 'jameschens', 
    api_key: '528374569883134', 
    api_secret: 'VA9rWIMADs_58FM_fz-_6L8G0Yo' 
  })

const multipart = require("connect-multiparty")
const multipartMiddleware = multipart();

app.use(
    session({
        secret: process.env.SESSION_SECRET || "our hardcoded secret", 
        saveUninitialized: false,
        resave: false,
        cookie: {
            expires: 600000,
            httpOnly: true
        },
        store: env === 'production' ? MongoStore.create({mongoUrl: process.env.MONGODB_URI || 'mongodb+srv://eric:1018@cluster0.onlqr.mongodb.net/BoothAPI?retryWrites=true&w=majority'}) : null
    })
);

app.get("/checkSession", (req, res) => {
    if (env !== 'production' && USE_TEST_USER) {
        req.session.user = TEST_USER_ID;
        req.session.username = TEST_USER_NAME;
        req.session.identity = TEST_USER_IDENTITY
        req.session.eventId = TEST_EVENT
        const currentUser = {
            userId: req.session.user,
            userName: req.session.username,
            identity: req.session.identity,
            eventId: req.session.eventId
        }
        res.send({ currentUser: currentUser })
        return;
    }
    if (req.session.user) {
        const currentUser = {
            userId: req.session.user,
            userName: req.session.username,
            identity: req.session.identity,
            eventId: req.session.eventId
        }
        User.findById(req.session.user).then((result)=>{
            currentUser.img = result.img
            res.send({ currentUser: currentUser });
        }).catch((error)=>{
            res.status(400).send("Bad request");
        })
    } else {
        res.status(401).send("Not authorized");
    }
});

app.get("/user/search/:id", async (req, res) => {
    console.log("Searching user:" + req.params.id);
    const userID = req.params.id
    try{
        const user = await User.findById(userID)
        if(user){
            let booths = []
            const Allbooths = await Booth.find()
            if(Allbooths){
                for(let i=0;i < Allbooths.length;i++){
                    const b = Allbooths[i]
                    if(b.creator.equals(user.id)){
                        booths.push(b)
                    }
                }
            }
            const returnUser = {
                userID: user.id,
                userName: user.username,
                email: user.email,
                identity: user.usertype,
                phone: user.phone,
                image: user.img,
                booths: booths,
                reservations: user.reservations
            }
            res.send(returnUser)
        } else {
            res.status(404).send("User not found")
        }
    } catch (error) { 
        console.log(error);
        res.status(400).send("No such user")
    };
});


// user
// log in
app.post("/api/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findByUsernamePassword(username, password)
        .then(user => {
            req.session.user = user._id;
            req.session.username = user.username;
            req.session.identity = user.usertype;
            req.session.eventId = req.session.eventId
            const currentUser = {
                userId: user.id,
                userName: user.username,
                identity: user.usertype,
                eventId: req.session.eventId
            }
            console.log(user.id + "just logged in");
            res.send({ currentUser: currentUser});
        })
        .catch(error => {
            res.status(400).send("No such user")
        });
});

app.get("/setEventSession/:id", (req, res) => {
    Exhibition.findById(req.params.id).then((result)=>{
        if(result){
            req.session.eventId = req.params.id
        }
        res.send("")
    }).catch((error)=>{
        console.log(error);
        res.status(404)
    })
});

app.get("/api/logout", (req, res) => {
    log("logging out")
    req.session.destroy((error) => {
        res.clearCookie('connect.sid', { path: '/' })
        if (error) {
            res.status(500).send(error);
        } else {
            res.send()
        }
    });
});

// register
app.post('/api/register', async (req, res) => {

    // Create a new user
    if (mongoose.connection.readyState != 1) {
		res.status(500).send('Internal server error')
		return;
	}
    User.findOne({ username: req.body.username }).then((user) => {
		if (user) {
			res.status(409).send('username exist')
            return;
		}
    })
    log(req.body)
    const user = new User({
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        usertype: req.body.userType,
        reservations: []
    })

    try {
        // Save the user
        const newUser = await user.save()
        res.send({id: newUser.id})
    } catch (error) {
        if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
            res.status(500).send('Internal server error')
        } else {
            log(error)
            res.status(400).send('Bad Request') // bad request for changing the student.
        }
    }
})

app.post('/api/editProfile/:id', multipartMiddleware, async (req, res) => {
    const id = req.params.id
    if (mongoose.connection.readyState != 1) {
		res.status(500).send('Internal server error')
		return;
	}

    try{
        if(!req.files.pic){
            const repeat = await User.findOne({username: req.body.userName})
            if(repeat && repeat !== 'null' && !repeat._id.equals(id)){
                res.status(409).send('Username exist')
                return;
            }
            const user = await User.findById(id)
            if(req.body.userName && req.body.userName !== 'null'){
                user.username = req.body.userName
            }
            if(req.body.email && req.body.email !== 'null'){
                user.email = req.body.email
            }
            if(req.body.phone && req.body.phone !== 'null'){
                user.phone = req.body.phone
            }
            user.save()
            .then((result) => {
                res.send({msg: 'success'})
                return
            }).catch((error) => {
                console.log(error);
                res.status(400).send("Bad request")
                return
            })
            return
        }
        cloudinary.v2.uploader.upload(req.files.pic.path, async function(error, result){
            if(error){
                console.log(error);
                res.status(500).send("Picture upload error")
                return
            }
            let img = {
                image_id: result.public_id,
                image_url: result.url,
                created_at: new Date(),
            }
            const user = await User.findById(id)
            if(req.body.userName && req.body.userName !== 'null'){
                user.username = req.body.userName
            }
            if(req.body.email && req.body.email !== 'null'){
                user.email = req.body.email
            }
            if(req.body.phone && req.body.phone !== 'null'){
                user.phone = req.body.phone
            }
            user.img = img
            user.save()
            .then((result) => {
                res.send({msg: "success"})
                return
            }).catch((error) => {
                console.log(error);
                res.status(400).send("Bad request")
                return
            })
        }).catch((error) => {
            console.log(error);
            res.status(400).send("Bad request")
            return
        })
    } catch(error){
        console.log(error);
    }
})

app.delete("/api/deleteUser/:userid", async (req, res) => {
    const userId = req.params.userid

    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 
    try{
        log("deleting user "+userId)
        const user = await User.findById(userId)
        const appointments = user.reservations
        for(let i=0; i< appointments.length; i++){
            const boothid = appointments[i].booth
            const time = appointments[i].time
            const booth = await Booth.findById(boothid)
            for(let j=0; j < booth.timeSlot.length; j++){
                if(booth.timeSlot[j].time === time){
                    if(appointments[i].status ==='book'){
                        // Check book list in booth
                        for (let k=0; k< booth.timeSlot[j].book.length; k++){
                            if(booth.timeSlot[j].book[k].equals(userId)){
                                log("delete booked appointments boothid: "+boothid + " "+ k)
                                booth.timeSlot[j].book.splice(k, 1)
                                break
                            }
                        }
                        if(booth.timeSlot[j].waitlist && booth.timeSlot[j].waitlist.length != 0){
                            log("Shifting waitlist")
                            const newUser = booth.timeSlot[j].waitlist[0]
                            booth.timeSlot[j].book.push(newUser)
                            booth.timeSlot[j].waitlist.splice(0,1)

                            try{
                                const luckyUser = await User.findById(newUser)
                                for(let k=0; k<luckyUser.reservations.length; k++){
                                    if(luckyUser.reservations[k].booth.equals(boothid)){
                                        luckyUser.reservations[k].status = 'book'
                                        await luckyUser.save()
                                        break
                                    }
                                }
                            } catch(error){
                                console.log("User in waitlist not available")
                                console.log(error)
                                booth.timeSlot[j].waitlist.splice(0, 1)
                            }

                        }else{
                            booth.timeSlot[j].availability += 1
                        }
                    }else {
                        // Check waitlist
                        for (let k=0; k< booth.timeSlot[j].waitlist.length; k++){
                            if(booth.timeSlot[j].waitlist[k].equals(userId)){
                                booth.timeSlot[j].waitlist.splice(k,1)
                                break
                            }
                        }
                    }
                    await booth.save()
                    break
                }
            }
        }

        const deletingUser = await User.findByIdAndRemove(userId)
        if (!deletingUser) {
			res.status(404).send('Resource not found')  
		}
        else{
            res.send({})
        }
    } catch (error) { 
        console.log(error);
        res.status(400).send("Bad request")
    };
});

app.get('/api/getAllUsers', async (req, res) => {
    try{
        const allUsers = await User.find()
        if(allUsers){
            const returnVal = []
            for(let i=0;i < allUsers.length;i++){
                const currUser = allUsers[i]
                returnVal.push({
                    userId: currUser._id,
                    userName: currUser.username,
                    identity: currUser.usertype
                })
            }
            res.send({users: returnVal})
        }else {
            res.send({users: []})
        }
    }catch(error){
        console.log(error);
        res.status(400).send("Bad request")
    }
})

app.get("/api/getAppointments/:userid", async (req, res)=>{
    const userID = req.params.userid
    try{
        const user = await User.findById(userID)
        if(user){
            res.send({appointments: user.reservations})
        }else{
            res.status(404).send("no such user")
        }
    }catch(error){
        res.status(400).send("Bad request")
    }
})

app.get("/api/getBoothAppointment/:boothid/:userid", async (req, res)=>{
    const userID = req.params.userid
    const boothID = req.params.boothid
    console.log("GetBoothAppointment");
    try{
        const user = await User.findById(userID)
        if(user){
            for(let i=0; i< user.reservations.length;i++){
                if(user.reservations[i].booth.equals(boothID)){
                    res.send({currentAppointment: user.reservations[i]})
                    return
                }
            }
        }else{
            res.send({currentAppointment: null})
        }
        res.send({currentAppointment: null})
    }catch(error){
        res.status(400).send("Bad request")
    }
})

app.post("/api/book/:booth_id/:user_id", async (req, res) => {
    const boothID = req.params.booth_id
    const userID = req.params.user_id
    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 
    try{
        const booth = await Booth.findById(boothID)
        const user = await User.findById(userID)
        if ((!booth) || !user) {
			res.status(404).send('Resource not found')  
		} 
        else{
            for (let i=0; i<user.reservations.length; i++) {
                if(user.reservations[i].booth.equals(boothID)){
                    res.status(409).send('Reservation exist')
                    return;
                }
            }
            let status = ''
            let timespot = null
            const timePeriod = req.body.timePeriod
            let timespots = booth.timeSlot
            for (let i=0; i<timespots.length; i++) {
                if(timespots[i].time === timePeriod){
                    timespot = timespots[i]
                    break
                }
            }
            if(timespot != null){
                // book
                if(timespot.availability != 0){
                    timespot.availability = timespot.availability - 1
                    timespot.book.push(userID)
                    status = 'book'
                }
                // waitlist
                else{
                    timespot.waitlist.push(userID)
                    status = 'waitlist'
                }
                booth.visitors.push(userID)
                await booth.save()

                const reservation = {
                    time: timespot.time,
                    boothName: booth.name,
                    booth: boothID,
                    status: status
                }
                user.reservations.push(reservation)
                await user.save()

                res.send({reservation: reservation})
                return;
            }
            return;
        }
    } catch (error) { 
        console.log(error);
        res.status(400).send("Bad request")
    };
});

app.post('/api/cancelAppointment/:boothId/:userId', async (req, res)=>{
    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 

    try{
        const userId = req.params.userId
        const boothId = req.params.boothId
        const user = await User.findById(userId)
        const booth = await Booth.findById(boothId)
        if(!user || !booth){
            res.status(404).send("No such object")
        }
        var status = 'book'
        for(let i=0; i< user.reservations.length; i++){
            if(user.reservations[i].booth.equals(boothId)){
                if(user.reservations[i].status==='waitlist'){
                    status = 'waitlist'
                }
                user.reservations.splice(i, 1)
                await user.save()
                break
            }
        }
        for(let j=0; j < booth.timeSlot.length; j++){
            if(booth.timeSlot[j].time === req.body.time){
                if(status==='book'){
                    // Check book list in booth
                    for (let k=0; k< booth.timeSlot[j].book.length; k++){
                        if(booth.timeSlot[j].book[k].equals(userId)){
                            booth.timeSlot[j].book.splice(k,1)
                            break;
                        }
                    }
                    if(booth.timeSlot[j].waitlist && booth.timeSlot[j].waitlist.length != 0){
                        const newUser = booth.timeSlot[j].waitlist[0]
                        booth.timeSlot[j].book.push(newUser)
                        booth.timeSlot[j].waitlist.splice(0,1)
                        try{
                            const luckyUser = await User.findById(newUser)
                            for(let k=0; k<luckyUser.reservations.length; k++){
                                if(luckyUser.reservations[k].booth.equals(boothId)){
                                    luckyUser.reservations[k].status = 'book'
                                    await luckyUser.save()
                                    break
                                }
                            }
                        } catch(error){
                            console.log("User in waitlist not available")
                            console.log(error);
                            booth.timeSlot[j].waitlist.splice(0, 1)
                        }
                    }else{
                        booth.timeSlot[j].availability += 1
                    }
                }else {
                    // Check waitlist
                    for (let k=0; k< booth.timeSlot[j].waitlist.length; k++){
                        if(booth.timeSlot[j].waitlist[k].equals(userId)){
                            booth.timeSlot[j].waitlist.splice(k,1)
                            break
                        }
                    }
                }
                await booth.save()
                break
            }
        }
        res.send("done")
    }catch(error){
        console.log(error);
        res.status(400).send("Bad request")
    }
})

// GET events

app.post('/api/editEvent/:id', multipartMiddleware, async (req, res) => {
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 

	try{
        const id = req.params.id
        if(!req.files || !req.files.pic){
            const event = await Exhibition.findById(id)
            if(req.body.name && req.body.name !== 'null'){
                event.name = req.body.name
            }
            if(req.body.brief && req.body.brief !== 'null'){
                event.brief = req.body.brief
            }
            if(req.body.description && req.body.description !== 'null'){
                event.description = req.body.desctiption
            }
            event.save()
            .then((result) => {
                res.send(result)
                return
            }).catch((error) => {
                console.log(error);
                res.status(400).send("Bad request")
                return
            })
            return
        }
        cloudinary.v2.uploader.upload(req.files.pic.path, async function(error, result){
            if(error){
                console.log(error);
                res.status(500).send("Picture upload error")
                return
            }
            let img = {
                image_id: result.public_id,
                image_url: result.url,
                created_at: new Date(),
            }
            const event = await Exhibition.findById(id)
            if(req.body.name && req.body.name !== 'null'){
                event.name = req.body.name
            }
            if(req.body.brief && req.body.brief !== 'null'){
                event.brief = req.body.brief
            }
            if(req.body.description && req.body.description !== 'null'){
                event.description = req.body.desctiption
            }
            event.bannerimg = img
            event.save()
            .then((result) => {
                res.send(result)
                return
            }).catch((error) => {
                console.log(error);
                res.status(400).send("Bad request")
                return
            })
        }).catch((error) => {
            console.log(error);
            res.status(400).send("Bad request")
            return
        })
    } catch(error){
        console.log(error);
    }
})

app.get('/api/getEventsMeta', async (req, res) => {
    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 
    Exhibition.find()
    .then((result) => {
        let returnVal = []
        result.map((each) => {
            const returnEach = {
                eventId: each.id,
                eventName: each.name,
                img: each.bannerimg,
                brief: each.brief
            }
            returnVal.push(returnEach)
        })
        res.send({eventList: returnVal})
    }).catch((error) => {
        console.log(error);
        res.status.bind(400).send('Bad Request')
    })
})

app.get("/api/getEvent/:id", async (req, res) => {
    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 
    try {
        const id = req.params.id
        const event = await Exhibition.findById(id)
        const booth_lst = event.booths
        const people_count = []
        var all_booths= []
        for (let i=0; i<booth_lst.length; i++) {
            const curr_booth = await Booth.findByBoothID(booth_lst[i])
            people_count.push(curr_booth.visitors.length)
            all_booths.push(curr_booth)
        }
        // find the index for top three people count
        const top_three_index = []
        for (let i = 0; i < people_count.length; i++) {
            top_three_index.push(i)
            if (top_three_index.length > 3) {
                top_three_index.sort(function(a, b) { return people_count[b] - people_count[a]; });
                top_three_index.pop();
            }
        }
        // store the top three booth object in top_three
        const top_three = []
        for (let i = 0; i<top_three_index.length; i++) {
            const curr_booth = await Booth.findByBoothID(booth_lst[top_three_index[i]])
            top_three.push({
                boothId: curr_booth.id,
                img: curr_booth.img,
                name: curr_booth.name
            })
        }
        res.send({event, top_three, all_booths})
    } catch (error) {
        console.log(error);
        res.status(400).send("Bad request")
    }
})

app.post("/api/createEvent", multipartMiddleware, async(req, res)=>{
    if (mongoose.connection.readyState != 1) {
		res.status(500).send('Internal server error')
		return;
	}

    Exhibition.findOne({ name: req.body.name }).then((exhibition) => {
		if (exhibition) {
			res.status(409).send('Exhibition name exist')
            return;
		}
    })

    try{
        cloudinary.v2.uploader.upload(req.files.pic.path, function(error, result){
            if(error){
                console.log(error);
            }
            let img = {
                image_id: result.public_id,
                image_url: result.url,
                created_at: new Date(),
            }
            let exhibition = new Exhibition({
                name: req.body.name,
                description: req.body.description,
                brief: req.body.brief,
                slogan: req.body.slogan,
                bannerimg: img,
                timeSlot: []
            })
            const newExhibition = exhibition.save()
            .then(() => {
                res.send(newExhibition)
                return
            }).catch((error) => {
                console.log(error);
                res.status(400).send("Bad request")
                return
            })
        }).catch((error) => {
            console.log(error);
            res.status(400).send("Bad request")
            return
        })
    } catch(error){
        console.log(error);
    }
})


// +++++++++ Booth ++++++++++

// GET booth
app.get("/booth/search/:id", async (req, res) => {
    const boothID = req.params.id
    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 
    try{
        const booth = await Booth.findById(boothID)
        const returnBooth = {
            name: booth.name,
            eventid: booth.eventid,
            description: booth.description,
            capacity: booth.capacity,
            timeSlot: booth.timeSlot,
            comments: booth.comments,
            manager: booth.creator,
            img: booth.img?booth.img.image_url: null
        }
        if(booth){
            res.send(returnBooth)
        } else {
            res.status(404).send("Booth not found")
        }
    } catch (error) { 
        console.log(error);
        res.status(400).send("Bad request")
    };
});

// edit booth for manager
app.post("/booth/edit/:id", multipartMiddleware, async (req, res) => {
    const id = req.params.id
    if (mongoose.connection.readyState != 1) {
		res.status(500).send('Internal server error')
		return;
	}

    try{
        if(!req.files.pic){
            const booth = await Booth.findById(id)
            if(req.body.name && req.body.name !== 'null'){
                booth.name = req.body.name
            }
            if(req.body.description && req.body.description !== 'null'){
                booth.description = req.body.description
            }
            await booth.save()
            .then((result) => {
                res.send(result)
                return
            }).catch((error) => {
                console.log(error);
                res.status(400).send("Bad request")
                return
            })
            return
        }
        cloudinary.v2.uploader.upload(req.files.pic.path, async function(error, result){
            if(error){
                console.log(error);
                res.status(500).send("Picture upload error")
                return
            }
            let img = {
                image_id: result.public_id,
                image_url: result.url,
                created_at: new Date(),
            }
            const booth = await Booth.findById(id)
            if(req.body.name && req.body.name !== 'null'){
                booth.name = req.body.name
            }
            if(req.body.description && req.body.description !== 'null'){
                booth.description = req.body.description
            }
            booth.img = img
            booth.save()
            .then((result) => {
                res.send(result)
                return
            }).catch((error) => {
                console.log(error);
                res.status(400).send("Bad request")
                return
            })
        }).catch((error) => {
            console.log(error);
            res.status(400).send("Bad request")
            return
        })
    } catch(error){
        console.log(error);
    }
})

// create booth
app.post("/api/createBooth", multipartMiddleware, async (req, res)=>{
    if (mongoose.connection.readyState != 1) {
		res.status(500).send('Internal server error')
		return;
	}

    Booth.findOne({ name: req.body.name }).then((booth) => {
		if (booth) {
			res.status(409).send('Booth name exist')
            return;
		}
    })
    try{
        const currentEvent = await Exhibition.findOne({name: req.body.event})
        let booth = new Booth({
            name: req.body.name,
            intro: req.body.intro,
            eventId:  currentEvent.id,
            description: req.body.description,
            img: null,
            creator: req.body.creator,
            comments: [],
            visitors: [],
            capacity: req.body.capacity,
            timeSlot: []
        })
        if(!req.files.pic){
            res.status(400).send("Need image")
            return
        }
        cloudinary.v2.uploader.upload(req.files.pic.path, async function(error, result){
            let img = {
                image_id: result.public_id,
                image_url: result.url,
                created_at: new Date(),
            }
            booth.img = img
            await booth.save().then((result) => {
                currentEvent.booths.push(result.id)
            }).catch((error)=>{
                console.log(error);
                res.status(400).send("Bad request")
                return
            })
            await currentEvent.save().catch((error)=>{
                console.log(error);
                res.status(400).send("Bad request")
                return
            })
            res.send(booth)
        }).catch((error) => {
            console.log(error);
            res.status(400).send("Bad request")
            return
        })
    } catch(error){
        console.log(error);
        res.status(400).send("Bad Request")
    }
})

app.post("/api/addTimeSlot/:id", async (req, res) => {
    const boothID = req.params.id
    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 
    try{
        const booth = await Booth.findById(boothID)
        if (!booth) {
			res.status(404).send('Resource not found')  
		} 
        else{
            const time_slot = {
                time: req.body.time,
                availability: req.body.capacity,
                book: [],
                waitlist: []
            }
            for(let i=0; i<booth.timeSlot.length; i++ ){
                if(booth.timeSlot[i].time === req.body.time){
                    res.status(409).send("Time already exists")
                    return
                }
            }
            booth.timeSlot.push(time_slot)
            await booth.save()
            res.send({booth, time_slot})
        }
    } catch (error) { 
        console.log(error);
        res.status(400).send("Bad request")
    };
});

app.post("/api/removeTimeSlot/:id", async (req, res) => {
    const boothID = req.params.id
    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 
    try{
        const booth = await Booth.findById(boothID)
        if (!booth) {
			res.status(404).send('Resource not found')  
		} 
        else{
            for(let i=0;i < booth.timeSlot.length; i++){
                if(booth.timeSlot[i].time === req.body.time){
                    booth.timeSlot[i].book.map((booking)=>{
                        User.findById(booking).then((result)=>{
                            if(result){
                                for(let j=0; j< result.reservations.length; j++){
                                    if(result.reservations[j].time === req.body.time && result.reservations[j].booth.equals(boothID)){
                                        result.reservations.splice(j, 1)
                                        result.save().catch((error)=>{throw error})
                                        break
                                    }
                                }
                            }
                        }).catch((error)=>{
                            console.log(error);
                        })
                    })
                    booth.timeSlot[i].waitlist.map((booking)=>{
                        User.findById(booking).then((result)=>{
                            if(result){
                                for(let j=0; j< result.reservations.length; j++){
                                    if(result.reservations[j].time === req.body.time && result.reservations[j].booth.equals(boothID)){
                                        result.reservations.splice(j, 1)
                                        result.save().catch((error)=>{throw error})
                                        break
                                    }
                                }
                            }
                        }).catch((error)=>{
                            console.log(error);
                        })
                    })
                    booth.timeSlot.splice(i, 1)
                    break
                }
            }
            const result = await booth.save()
            res.send({result})
        }
    } catch (error) { 
        console.log(error);
        res.status(400).send("Bad request")
    };
});

app.post("/api/addComment/:id", async (req, res) => {
    const boothID = req.params.id
    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 
    try{
        const booth = await Booth.findById(boothID)
        if (!booth) {
			res.status(404).send('Resource not found')  
		} 
        else{
            const comment = {
                user: req.body.user,
                comment: req.body.comment
            }
            booth.comments.push(comment)
            await booth.save()

            const returnComment = []
            // Now we are trying to return the comment
            for (let idx = 0; idx < booth.comments.length; idx++){
                const comment = booth.comments[idx]
                const userid = comment.user
                const returnUser = {
                    userName: "",
                    image: "",
                }
                try{
                    const user = await User.findById(userid)
                    if(user){
                        returnUser.userName = user.username,
                        returnUser.image = user.img? user.img.image_url: null
                    } else {
                        returnUser.userName = "Deleted user",
                        returnUser.image = null
                    }
                } catch (error) { 
                    returnUser.userName = "Deleted user",
                    returnUser.image = null
                };
                const oneUpdatedComment = {
                    id: comment.id,
                    userName: returnUser.userName,
                    userIcon: returnUser.image,
                    comment: comment.comment
                }
                returnComment.push(oneUpdatedComment)
            }
            res.send(returnComment)
        }
    } catch (error) { 
        console.log(error);
        res.status(400).send("Bad request")
    };
});

app.get("/api/allComments/:boothid", async (req, res) => {
    const boothID = req.params.boothid
    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 
    try{
        const booth = await Booth.findById(boothID)
        if (!booth) {
			res.status(404).send('Resource not found')  
		} 
        else{
            const returnComment = []
            // Now we are trying to return the comment
            for (let idx = 0; idx < booth.comments.length; idx++){
                const comment = booth.comments[idx]
                const userid = comment.user
                const returnUser = {
                    userName: "",
                    image: "",
                }
                try{
                    const user = await User.findById(userid)
                    if(user){
                        returnUser.userName = user.username,
                        returnUser.image = user.img?user.img.image_url: null
                    } else {
                        returnUser.userName = "Deleted user",
                        returnUser.image = null
                    }
                } catch (error) { 
                    returnUser.userName = "Deleted user",
                    returnUser.image = null
                };
                const oneUpdatedComment = {
                    id: comment.id,
                    userName: returnUser.userName,
                    userIcon: returnUser.image,
                    comment: comment.comment
                }
                returnComment.push(oneUpdatedComment)
            }
            res.send(returnComment)
        }
    } catch (error) { 
        console.log(error);
        res.status(400).send("Bad request")
    };
});

app.delete("/api/deleteComment/:id/:com_id", async (req, res) => {
    const boothID = req.params.id
    const com_id = req.params.com_id

    if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection')
		res.status(500).send('Internal server error')
		return;
	} 
    try{
        const booth = await Booth.findById(boothID)
        if (!booth) {
			res.status(404).send('Resource not found')  
		} 
        else{
            console.log(req.body)
            const comment = booth.comments.id(com_id)
            if(comment){
                booth.comments.remove(comment)
                await booth.save()
                res.send(booth)
            }
            else{
                res.status(404).send('Resource not found')  
            }
        }
    } catch (error) { 
        console.log(error);
        res.status(400).send("Bad request")
    };
});

// ------------------  Build and Release ----------------------//
app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    log(`Listening on port ${port}...`);
});