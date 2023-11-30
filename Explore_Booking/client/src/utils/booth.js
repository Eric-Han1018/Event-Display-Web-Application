import ENV from "config"

const API_HOST = ENV.api_host

export const postEditBooth = (comp, form, id) => {
    const request = new Request(`${API_HOST}/booth/edit/` + id,{
        method: 'POST',
        body: form
    })
    fetch(request)
    .then((res) => {
        if(res.status === 200){
            console.log(res)
            return
        }
        else{
            console.log(res.status)
            comp.setState({
                warningMsg: "Invalid input"
            })
            return
        }
    }).catch((error) => {
        console.log(error)
        comp.setState({
            warningMsg: "Request Error"
        })
    })
}

export const getBoothInfo = (boothid, component) => {
    const request = new Request(`${API_HOST}/booth/search/` + boothid, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })

    fetch(request)
    .then((res) => {
        if(res.status === 200){
            return res.json()
        }
    }).then((json) => {
        console.log(json);
        if(json){
            if(component.props.app.state.currentUser != null){
                const userId = component.props.app.state.currentUser.userId;
                console.log(userId)
                const times = json.timeSlot
                for (let i=0; i<times.length; i++) {
                    if(times[i].book.includes(userId) || times[i].waitlist.includes(userId)){
                        console.log("yes")
                        const appointment = {
                            boothName: json.name,
                            time: times[i].time
                        }
                        component.setState({
                            currentAppointment: appointment
                        })
                    }
                }
            }
            component.setState(
                {
                    name: json.name,
                    eventid: json.eventid,
                    description: json.description,
                    capacity: json.capacity,
                    timeSlot: json.timeSlot,
                    comments: json.comments,
                    manager: json.creator,
                    img: json.img
                }
            )
            console.log(json);
        }
    }).catch((error) => {
        console.log(error);
        return
    })
}

export const addBooth = (comp, form) => {
    console.log("calling this");
    const req = new Request(`${API_HOST}/api/createBooth`, {
        method: "Post",
        body: form
    })
    fetch(req)
    .then((res) => {
        if(res.status === 200){
            window.location.href = '/profile/' + comp.state.currentUser.userId
            return
        } else {
            comp.setState({
                invalidInfo: "Invalid information"
            })
            return false
        }
    }).catch ((error) => {
        console.log(error);
        comp.setState({
            invalidInfo: "Service error"
        })
        return false
    })
}

export const addTimeSlot = (comp, body, id) => {
    const req = new Request(`${API_HOST}/api/addTimeSlot/` + id, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    fetch(req)
    .then((res)=>{
        if(res.status === 200){
            res.json()
        }
    }).then((result)=>{
        getBoothInfo(id, comp)
    }).catch((error)=>{
        console.log(error)
    })
}

export const removeTimeAPI = (comp, body, id) => {
    const req = new Request(`${API_HOST}/api/removeTimeSlot/`+id, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    fetch(req)
    .then((res)=>{
        if(res.status === 200){
            res.json()
        }
    }).then((result)=>{
        getBoothInfo(id, comp)
        window.location.reload(false)
        console.log(comp.state);
    }).catch((error)=>{
        console.log(error)
    })
}

export const addComment = (component, body_Comment, boothid) => {
    console.log("Under addComment in booth.js, body_comment:")
    console.log(body_Comment)
    const request = new Request(`${API_HOST}/api/addComment/`+boothid, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body_Comment)
    })

    fetch(request)
    .then((res) => {
        if(res.status === 200){
            console.log(res)
            return res.json()
        }else{
            console.log(res.status)
            component.setState({
                warningMsg: "Invalid input"
            })
            return
        }
    }).then((comments) => {
        console.log(comments);
        if(comments){
            console.log("gonna update state!")
            component.setState(
                {
                    comments: comments,
                    commentCount: comments.length
                }
            )
            console.log(comments);
        }
    }).catch((error) => {
        console.log(error)
        component.setState({
            warningMsg: "Request Error"
        })
    })
} 

export const setAllComments = (component, boothId) => {

    const request = new Request(`${API_HOST}/api/allComments/`+ boothId, {
        method: "GET",
    })
    fetch(request)
    .then((res) => {
        if(res.status === 200){
            console.log(res)
            return res.json()
        }else{
            console.log(res.status)
            component.setState({
                warningMsg: "Invalid input"
            })
            return
        }
    }).then((comments) => {
        console.log(comments);
        if(comments){
            console.log("gonna update state!")
            component.setState(
                {
                    comments: comments,
                    commentCount: comments.length
                }
            )
        }
    }).catch((error) => {
        console.log(error)
        component.setState({
            warningMsg: "Request Error"
        })
    })
}

export const removeComment = (component, boothid, commentid) => {
    const request = new Request(`${API_HOST}/api/deleteComment/` + boothid + "/" +commentid, {
        method: "Delete",
    })
    fetch(request)
    .then((res) => {
        if(res.status === 200){
            console.log(res)
            return res.json()
        }
    }).then((json) => {
        if(json){
            // component.setState(
            //     {
            //         comments: json.comments
            //     }
            // )
            setAllComments(component, boothid)
            console.log(json);
        }
    }).catch((error) => {
        console.log(error)
        component.setState({
            warningMsg: "Request Error"
        })
    })
} 