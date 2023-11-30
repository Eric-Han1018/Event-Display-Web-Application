import './style.css';
import React from 'react';
// import cookieFunc from 'components/cookie/cookie';

import HomeSlot from 'components/HomeSlot'
import Dropdown from 'components/AppointmentDropdown';

import { logout } from "./../../utils/user";

class Header extends React.Component{

    constructor(props){
        super(props)
        this.checkProfile = this.checkProfile.bind(this)
    }

    logOut = (app) => {
        logout(app);
    };

    checkSignedIn(){
        const user = this.props.user
        const app = this.props.app;
        let userImg = null
        if(user){
            userImg = user.img? user.img.image_url : null
        }
        if(user !== null && user !== undefined){
            let userIdentity = user.identity
            if(userIdentity === 'user'){
                userIdentity = 'Explorer'
            }
            return(
                <span>
                    <span className="CurrentReservation">
                        {this.checkIfHasAppointment()}
                    </span>
                    <span className="AvatarSlot">
                        <div id="userMetaBlock">
                            <span className="userMeta">{user.userName}</span>
                            <span className="userMeta">{userIdentity}</span>
                        </div>
                        <span className="logOutDrop">
                            <img src={userImg} alt="" className="Avatar" onClick = {this.checkProfile}></img>
                            <div className="ProfileBtn" onClick={this.checkProfile}>Profile</div>
                            <div className="logOutBtn" onClick={() => this.logOut(app)}>Log Out</div>
                        </span>
                    </span>
                </span>
            )
        } else {
            return (
                <span className="AvatarSlot">
                    <button className="SignInButton" onClick={this.login}>
                        Sign in
                    </button>
                </span>
            )
        }
    }

    checkProfile () {
        window.location.href='/profile/'+this.props.user.userId
    }

    login () {
        window.location.href = "/login"
    }

    checkIfHasAppointment(){
        if(this.props.user && this.props.user.identity === 'user'){
            return (<Dropdown/>)
        } else {
            return 
        }
    }

    render(){
        return (
            <div className="header">
                <span className="Home">
                    <HomeSlot user={this.props.user} app={this.props.app}/>
                </span>
                {this.checkSignedIn()}
            </div>
        )
    }
}

export default Header