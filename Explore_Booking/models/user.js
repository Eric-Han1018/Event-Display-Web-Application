const mongoose = require('mongoose');
// const { Booth } = require('./booth');

const image = mongoose.Schema({
    image_id: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    created_at: String
});

const reservation = new mongoose.Schema({
	time: {
		type: String,
		required: true
	},
	booth: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	boothName: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	}
})

const UserSchema = new mongoose.Schema({
	fullname: {
		type: String,
		required: true,
		minlength: 1
	}, 
	password: {
		type: String,
		required: true,
		minlength: 4
	},
    username: {
        type: String,
		required: true,
		minlength: 1,
        maxlength: 20,
        trim: true,
        unique: true
    },
    email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true
	},
    usertype: {
        type: String,
        required:true
    },
	phone:{
		type: Number
	},
    img: image,
	reservations: [reservation],
    booth: mongoose.Schema.Types.ObjectId
});

UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this
	// First find the user by username
	return User.findOne({ username: username }).then((user) => {
		if (!user) {
			return Promise.reject()  // not found
		}
		// check password
		return new Promise((resolve, reject) => {
			if(password === user.password){
				resolve(user)
			}
			else{
				reject()
			}
		})
	})
}


const User = mongoose.model('User', UserSchema);
module.exports = { User };
