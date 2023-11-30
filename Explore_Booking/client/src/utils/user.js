import ENV from "config"

const API_HOST = ENV.api_host

export const login = (credentials, app) => {
    const request = new Request(`${API_HOST}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    })

    fetch(request)
    .then((res) => {
        if(res.status === 200){
            return res.json()
        }
    }).then((json) => {
        if(json && json.currentUser){
            app.setState({
                currentUser: json.currentUser
            })
            if(json.currentUser.identity === 'admin'){
                window.location.href = '/profile/'+json.currentUser.userId
            }else {
                window.location.href = '/chooseEvent'
            }
            console.log("logged in");
        } else {
            console.log("Incorrect Credentials");
        }
    }).catch((error) => {
        console.log(error);
    })
}

export const register = (credentials) => {
    console.log(credentials.state);
    const request = new Request(`${API_HOST}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials.state)
    })

    fetch(request)
    .then((res) => {
        if(res.status === 200){
            console.log(res)
            window.location.href = '/login'
        }
        else{
            credentials.setState({message: 'Error: Wrong Information, please register again'})
        }
    }).catch((error) => {
        console.log(error)
    })
}

export const logout = (app) => {
    const url = `${API_HOST}/api/logout`;
    const req = new Request(url, {
        method: 'GET'
    })
    fetch(req)
        .then(res => {
            console.log(res);
            app.setState({
                currentUser: null,
            });
        })
        .catch(error => {
            console.log(error);
        });
};

export const checksession = (app, callback) => {
    if (!ENV.use_frontend_test_user) {
        fetch(`${API_HOST}/checkSession`)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
        })
        .then((json) => {
            if (json && json.currentUser) {
                app.setState({currentUser: json.currentUser}, callback);
            }
        })
        .catch(error => {
            console.log(error);
        });
    } else {
        app.setState({ currentUser: ENV.user}, callback)
    }
}

export const setEventSession = (id)=>{
    const req = new Request(`${API_HOST}/setEventSession/` + id, {
        method: 'get'
    })
    fetch(req).then((result)=>{
        window.location.href = '/home/'+ id
        return
    }).catch((error)=>{
        return
    })
}

export const getUserInfo = (userID, component) => {
    const req = new Request(`${API_HOST}/user/search/` + userID, {
        method:'Get',
        headers: {'Content-Type': 'application/json'}
    })
    fetch(req).then((res) => {
        return res.json()
    }).then((json) => {
        if(json){
            console.log(json.image);
            component.setState(
                {
                    userID: json.userID, 
                    userName: json.userName,
                    email: json.email,
                    phone: json.phone,
                    identity: json.identity,
                    img: json.image,
                    boothlist: json.booths,
                    reservations: json.reservations
                }
            )
        }
    }).catch((error) => {
        console.log(error);
        return
    })
}

export const postEditProfile = (comp, form, id)=>{
    const request = new Request(`${API_HOST}/api/editProfile/` + id, {
        method: 'POST',
        body: form
    })
    fetch(request)
    .then((res) => {
        if(res.status === 200){
            console.log(res)
            window.location.href = '/profile/'+id
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

export const getAppointments = (comp, userid) => {
    const req = new Request (`${API_HOST}/api/getAppointments/`+userid, {
        method: "Get"
    })

    fetch(req).then((res)=>{
        if(res.status===200){
            return res.json()
        }
    }).then((result)=>{
        if(result){
            comp.setState({
                appointments: result.appointments
            })
        }
    })
}

export const getAppointmentOfBooth = (comp, boothid, userid) => {
    const req = new Request (`${API_HOST}/api/getBoothAppointment/`+boothid+"/"+userid, {
        method: "GET"
    })

    fetch(req).then((res)=>{
        if(res.status === 200){
            return res.json()
        }
    }).then((result)=>{
        if(result){
            comp.setState({
                currentAppointment: result.currentAppointment
            })
        }
    })

}

export const getAllUsers = (comp) => {
    const req = new Request(`${API_HOST}/api/getAllUsers`, {
        method: 'get'
    })
    fetch(req)
    .then((res)=>{
        if(res.status === 200){
            return res.json()
        }
    }).then((result)=>{
        comp.setState({
            users: result.users
        })
    }).catch((error)=>{
        return
    })
}

export const adminRegister = (comp, credentials) => {
    console.log(credentials);
    const request = new Request(`${API_HOST}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    })

    fetch(request)
    .then((res) => {
        if(res.status === 200){
            console.log(res)
            getAllUsers(comp)
        }
        else{
            comp.setState({warnMsg: 'Error: Wrong Information, please register again'})
        }
    }).catch((error) => {
        console.log(error)
    })
}

export const bookAppointment = (comp, timePeriod, booth_id, user_id)=>{
    const request = new Request(`${API_HOST}/api/book/` + booth_id + `/` +user_id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timePeriod)
    })
    fetch(request)
    .then((res) => {
        if(res.status === 200){
            return res.json()
        }else{
            console.log(res);
        }
    }).then((result)=>{
        if(result){
            comp.setState({
                currentAppointment: result.reservation
            })
            window.location.reload()
        }
    }).catch((error) => {
        console.log(error)
        // comp.setState({
        //     warningMsg: "Request Error"
        // })
    })
}

export const cancelAppointmentAPI = (comp, time, booth_id, user_id)=>{
    console.log(time);
    const req = new Request(`${API_HOST}/api/cancelAppointment/`+booth_id+'/'+user_id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({time: time})
    })

    fetch(req)
    .then((res)=>{
        if(res.status === 200){
            return
        }
    }).then((result)=>{
        comp.setState({
            currentAppointment: null
        })
        window.location.reload(false)
    }).catch((error)=>{
        console.log(error);
    })

}

export const deleteUserAPI = (comp, user_id)=>{
    const req = new Request(`${API_HOST}/api/deleteUser/`+user_id, {
        method: 'DELETE',
    })
    fetch(req)
    .then((res)=>{
        if(res.status === 200){
            return
        }
    }).then((result)=>{
        getAllUsers(comp)
    }).catch((error)=>{
        console.log(error);
    })

}