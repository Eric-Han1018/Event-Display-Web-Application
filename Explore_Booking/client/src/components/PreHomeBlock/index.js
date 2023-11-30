import React from "react";
import { setEventSession } from "utils/user";
import "./style.css"

class boothBlock extends React.Component{
    
    constructor(props){
        super(props)
        this.goDetail = this.goDetail.bind(this)
    }

    componentDidMount(){
        document.getElementById("EventImg" + this.props.eventId).style.backgroundImage = "url("+this.props.img+")"
    }

    goDetail(){
        // Will be directed to different booths' views afterwards
        setEventSession(this.props.eventId)
    }

    render (){
        const eventID = "EventImg" + this.props.eventId
        return ( 
            <div className = "EventBlock">
                <div className="EventImg" id={eventID} onClick={this.goDetail}></div> 
                <div className="EventName">{this.props.eventName}</div>
                <div className="EventIntro">{this.props.eventIntro}</div>
            </div>
        )
    }
}

export default boothBlock