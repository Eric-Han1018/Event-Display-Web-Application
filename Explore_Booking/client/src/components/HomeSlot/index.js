import React from "react";
import './style.css'
import Homepng from 'img/logos/home.png'

/**
 * The slot in the header that clicks to get back to homepage
 */
class HomeSlot extends React.Component{

    constructor(props){
        super(props)
        this.goHome = this.goHome.bind(this)
    }

    goHome() {
        let currEvent = null
        if(this.props.app.state.currentUser){
            currEvent = this.props.app.state.currentUser.eventId
        }
        window.location.href = '/home/' + currEvent
    }

    goPreHome(){
        window.location.href = '/chooseEvent'
    }

    render(){
        return (
            <div className="HomeSlot">
                <div id="ChooseEvent" onClick={this.goPreHome}>
                    - More Events
                    <span id="toolTip">Event selection</span>
                </div>
                {(this.props.app.state.currentUser && this.props.app.state.currentUser.eventId)?(<span id="GoHomeCombo" onClick={this.goHome}><img id="Home" src={Homepng} alt=""></img><span id="HomeText">Home</span></span>):null}
            </div>
        )
    }
}

export default HomeSlot