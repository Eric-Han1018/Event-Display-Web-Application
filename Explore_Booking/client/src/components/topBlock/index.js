import React from "react";
import "./index.css"

class topBlock extends React.Component{


    constructor(props){
        super(props)
        this.goDetail = this.goDetail.bind(this)
    }

    goDetail(){
        window.location.href = '/boothview/'+this.props.boothId
    }

    componentDidMount(){
        document.getElementById("topImage" + this.props.boothId).style.backgroundImage = "url("+this.props.img+")"
    }

    render (){
        const topImgID = "topImage" + this.props.boothId
        
        return (
            <div>
                <div className = "topComponent">
                    <div className="topImg" id={topImgID} onClick={this.goDetail}>
                        <div className="topName">{this.props.topName}</div>
                    </div> 
                </div>
            </div>    
        )
    }
}

export default topBlock