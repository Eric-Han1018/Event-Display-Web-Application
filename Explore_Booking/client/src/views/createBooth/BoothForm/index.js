import React from "react";
import "./style.css"

class editBooth extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            manager: '',
            managerList:[],
            managerCount: 0
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handlePicChange = this.handlePicChange.bind(this)
        this.component = this.props.callingComp
    }

    handleInputChange(event){
        const target = event.target
        const name = target.name
        const value = target.value
        this.component.setState({
            [name]:value
        })
    }

    handlePicChange(event){
        const target = event.target
        const name = target.name
        const value = target.files[0]
        this.component.setState({
            [name]:value
        })
    }

    render (){
        return (
            <div className="boothFormContainer">
                <h1>Create Booth</h1>
                <div className = "boothForm">
                    <div id='boothTitle'>
                        <span className="boothFormLabel">Booth Title</span>
                        <input className="boothForminput" name="name" type="text" onChange={this.handleInputChange}/>
                    </div>
                    <div id='boothEvent'>
                        <span className="boothFormLabel">Event</span>
                        <input className="boothForminput" name="event" type="text" onChange={this.handleInputChange}/>
                    </div>
                    <div id='boothBrief'>
                        <span className="boothFormLabel">Brief Intro</span>
                        <textarea className="boothForminput" id="briefIntroInput" name="intro" cols="50" rows="20" onChange={this.handleInputChange}/>
                    </div>
                    <div id='boothDesctiption'>
                        <span className="boothFormLabel">Booth description</span>
                        <textarea className="boothForminput" id="descriptionInput" name="description" cols="50" rows="20" onChange={this.handleInputChange}/>
                    </div>
                    <div id='boothCapacity'>
                        <span className="boothFormLabel">Capacity</span>
                        <input className="boothForminput" type="number" name="capacity" onChange={this.handleInputChange}/>
                    </div>
                    <div id='boothPic'>
                        <span className="boothFormLabel">Booth picture</span>
                        <input className="boothForminput" type="file" name="pic" onChange={this.handlePicChange}/>
                    </div>
                </div>
            </div>    
        )
    }
}

export default editBooth