import './index.css';
import React from 'react';
import Layout from 'layouts/pageLayout'
import Button from "@material-ui/core/Button";
import { checksession, getAppointments, getUserInfo } from 'utils/user';
import bgImg from 'img/login/grey.png'
import { getEventsMeta } from 'utils/exhibition';

class Profile extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            currentUser: null,
            userID: "", 
            userName: "",
            email: "",
            phone: "",
            identity: "",
            img: null,
            eventlist: [],
            boothlist: [],
            appointments: []
        }
        this.edit = this.edit.bind(this)
    }

    editEvent(id){
        window.location.href = '/editEvent/' + id
    }

    editBooth(id){
        window.location.href = '/editBooth/' + id
    }

    goCreateBooth(){
        window.location.href="/createBooth"
    }

    switchPage(){
        window.location.href = '/editBooth/' + this.props.app.state.currentUser.userId
    }

    createEvent(){
        window.location.href = '/createEvent'
    }

    manageUsers(){
        window.location.href = '/manageUsers'
    }


    componentDidMount(){
        const params = window.location.href.split('/')
        const userID = params[params.length - 1]
        getUserInfo(userID, this)
        checksession(this,()=>{this.checkIdentity()})
    }

    checkIdentity(){
        if(!this.state.currentUser){
            return
        }
        if(this.state.currentUser.identity === 'admin'){
            getEventsMeta(this)
        }else if(this.state.currentUser.identity === 'manager'){

            return
        }else{
            getAppointments(this, this.state.currentUser.userId)
        }
    }

    edit(){
        window.location.href = '/editProfile/'+this.props.app.state.currentUser.userId
    }

    checkUser(){
        if(!this.props.app.state.currentUser || (this.props.app.state.currentUser.userId !== this.state.userID)){
            return
        }
        if(this.props.app.state.currentUser.identity === "manager"){
            return (
                <div>
                    <div className='newboothbutton'>
                        <Button
                                variant="contained"
                                onClick={this.goCreateBooth}>
                                New Booth
                        </Button>
                    </div>
                </div>
            )
        } else if (this.props.app.state.currentUser.identity === "admin") {
            return (
                <div>
                    <div className='editexhibition'>
                    </div>
                    <div className='newexhibitionbutton'>
                        <Button
                            variant="contained"
                            onClick={() => this.createEvent()}>
                            New Event
                        </Button>
                    </div>
                    <div className='managebutton'>
                        <Button
                            variant="contained"
                            onClick={this.manageUsers}>
                            Manage all users
                        </Button>
                    </div>
                </div>
            )
        }
        
    }

    appointmentOrEvents(){
        console.log(this.state);
        if(!this.props.app.state.currentUser || (this.props.app.state.currentUser.userId !== this.state.userID)){
            return
        }
        if(this.props.app.state.currentUser.identity === 'admin'){
            return (
                <div className="exhibition">
                    <h1 className="title">My Events:</h1>
                    <ul className="list">
                        {this.state.eventlist.map((exhibition) => {
                            return (
                                <li>
                                    <button className="exhibitionStatusBtn" onClick={()=>this.editEvent(exhibition.eventId)}>
                                        edit
                                    </button> 
                                    {exhibition.eventName} 
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )
        } else if (this.props.app.state.currentUser.identity === 'manager'){
            return (
                <div className="booth">
                    <h1 className="title">My booths:</h1>
                    <ul className="list">
                        {this.state.boothlist.map((booth) => {
                            return (
                                <li>
                                    <button className="exhibitionStatusBtn" onClick={()=>this.editBooth(booth._id)}>
                                        edit
                                    </button> 
                                    {booth.name} 
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )
        } else {
            return (
                <div className="appointments">
                    <h1 className="title">Appointments:</h1>
                    {this.state.appointments.map((appointment)=>{
                        return (
                        <ul className="list" key={appointment.boothId}>
                            <li>{appointment.boothName}<div class="boothapp">time: {appointment.time}{appointment.status === 'book'? null: '(waitlist)'}</div></li>
                        </ul>)
                    })}
                </div>
            )
        }
    }


    render(){
        return (
            <Layout user={this.props.app.state.currentUser} app = {this.props.app}> 
                <div id="bannerContainer"><img id="profileBanner" src={bgImg} alt=''/></div>
                <div className="profiletotal">
                    <div className="leftpart">
                        <img className="photo" src={this.state.img? this.state.img.image_url:null} alt=""/>
                        {(!this.props.app.state.currentUser || (this.props.app.state.currentUser.userId !== this.state.userID))? null:(
                            <div className='editbutton'>
                            <Button
                                    variant="contained"
                                    onClick={() => this.edit()}
                            >
                                    Edit Profile
                            </Button>
                        </div>
                        )}
                        {this.checkUser()}
                    </div>
                    <div className="profile">
                        <h1 className="Username"> Welcome to {this.state.userName}'s profile</h1>
                        <div className="email"><b> email: </b> {this.state.email}</div>
                        <div className="phone"><b> phone: </b> {this.state.phone}</div>
                        <div className="identity"><b> identity: </b>{this.state.identity}</div>
                    </div>
                    {this.appointmentOrEvents()}
                </div>
            </Layout>
        );
    }
}

export default Profile