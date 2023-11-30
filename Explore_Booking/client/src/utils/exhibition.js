import ENV from "config"

const API_HOST = ENV.api_host

export const getEvent = (id, component) => {
    const request = new Request(`${API_HOST}/api/getEvent/` + id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })

    fetch(request)
    .then((res) => {
        if(res.status === 200){
            return res.json()
        }
    }).then((json) => {
        if(json){
            component.setState(
                {
                    name: json.event.name, 
                    description: json.event.description,
                    booth_lst: json.all_booths,
                    slogan: json.event.slogan,
                    img: json.event.bannerimg,
                    top_three: json.top_three,
                    brief: json.event.brief
                }
            )
        }
        
    }).catch((error) => {
        console.log(error);
        return
    })
}

export const getEventsMeta = (comp) => {

    const req = new Request(`${API_HOST}/api/getEventsMeta`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'}
    })

    fetch(req)
    .then((res) => {
        if(res.status === 200){
            return res.json()
        } else {
            return
        }
    }).then((json)=>{
        comp.setState({
            eventlist: json.eventList
        })
    }).catch((error) => {
        console.log(error);
        comp.setState({
            eventlist: []
        })
    })
    return
}

export const addEvents = (comp, form) => {
    const req = new Request(`${API_HOST}/api/createEvent`, {
        method: "Post",
        body: form
    })
    fetch(req)
    .then((res) => {
        if(res.status === 200){
            window.location.href='/profile/' + comp.state.currentUser.userId
            return true
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

export const postEditEvent = (comp, form, id)=>{
    const request = new Request(`${API_HOST}/api/editEvent/` + id, {
        method: 'POST',
        body: form
    })
    fetch(request)
    .then((res) => {
        if(res.status === 200){
            return res.json()
        }else{
            comp.setState({
                warningMsg: "Invalid input"
            })
            return
        }
    }).then((result) => {
        console.log(result);
        window.history.back()
    }).catch((error) => {
        console.log(error)
        comp.setState({
            warningMsg: "Request Error"
        })
    })
}