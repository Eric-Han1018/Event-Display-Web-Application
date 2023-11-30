// import { currentUser } from "components/cookie/cookie";
import React from "react";
import "./style.css"

class boothBlock extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
            link: this.props.link
        }
        this.bookActivity = this.bookActivity.bind(this)
        this.goDetail = this.goDetail.bind(this)
    }

    componentDidMount(){
        document.getElementById("boothImage" + this.props.boothId).style.backgroundImage = "url("+this.props.img+")"
    }

    goDetail(){
        //Hardcode here
        // Will be directed to different booths' views afterwards
        window.location.href = '/Boothview/'+ this.props.boothId
    }

    bookActivity(){
        // Hard Code here. We will directly set the button to disable.
        // In phase 2, this will be dependent on the return value from server.
        document.getElementById("boothButton" + this.props.boothId).disabled = true
    }

    render (){
        const boothImageID = "boothImage" + this.props.boothId
        return ( 
            <div>
                <div className = "boothComponent">
                    <div className="boothImg" id={boothImageID} onClick={this.goDetail}>
                        <div className="boothName">{this.props.boothName}</div>
                    </div> 
                    <div className="boothIntro">{this.props.boothIntro}</div>
                </div>
            </div>    
        )
    }
}

export default boothBlock