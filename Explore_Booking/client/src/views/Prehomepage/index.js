import './index.css';
import React from 'react';
import Block from 'components/PreHomeBlock/index'
import { getEventsMeta } from 'utils/exhibition';

class Prehome extends React.Component{

    constructor(props){
        super(props)
        this.generateEventBlock = this.generateEventBlock.bind(this)
        this.getEventList = this.getEventList.bind(this)
        this.checkProfile = this.checkProfile.bind(this)
        this.state = {
            eventlist: []
        }
    }

    introduction = {
        theme: "Current Theme Parks",
        intro: "Pick a theme park and explore more"
    }
    
    getEventList(){
        getEventsMeta(this)
    }

    componentDidMount(){
        this.getEventList()   
    }

    generateEventBlock (){
        const EventBlocks = this.state.eventlist.map((event)=>{
            return (
                <Block 
                    key={event.eventId} 
                    eventName={event.eventName} 
                    eventIntro={event.brief} 
                    eventId={event.eventId} 
                    img={event.img?event.img.image_url:null}/>
            )
        }) 
        return EventBlocks?EventBlocks:"There's no event yet. Log in as a admin to add events"
    }

    login () {
        window.location.href = "/login"
    }

    checkProfile () {
        window.location.href='/profile/'+this.props.app.state.currentUser.userId
    }

    goProfile (){
        if(!this.props.app.state.currentUser){
            return(
                <button className="SignInButton" onClick={this.login}>
                    Sign in
                </button>)
        }
        if(this.props.app.state.currentUser && this.props.app.state.currentUser.identity === 'admin'){
            return (
                <button className="SignInButton" onClick={this.checkProfile}>
                    Go to profile
                </button>)
        }
    }

    render(){

        return (
            <div>
                <div className="PreHomebanner">
                    <div className="Theme">{this.introduction.theme}</div>
                    <div className="Intro">{this.introduction.intro}</div>
                </div>
                <div className="PreHomesubStations">
                    {this.generateEventBlock()}
                </div>
                {this.goProfile()}
            </div>
        )
    }
}

export default Prehome