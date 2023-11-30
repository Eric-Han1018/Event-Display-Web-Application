import React from "react";
import "./style.css"

class Editevent extends React.Component{

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
            <div className="eventFormContainer">
                <h1>Create event</h1>
                <div className = "eventForm">
                    <div id='Title'>
                        <span className="label">Event Title</span>
                        <input className="input" name="name" type="text" onChange={this.handleInputChange}/>
                    </div>
                    <div id='eventBrief'>
                        <span className="label">Brief Intro</span>
                        <textarea className="input" id="briefIntroInput" name="intro" cols="50" rows="20" onChange={this.handleInputChange}/>
                    </div>
                    <div id='eventSlogan'>
                        <span className="label">Slogan</span>
                        <input className="input" name="slogan" type="text" onChange={this.handleInputChange}/>
                    </div>
                    <div id='eventDesctiption'>
                        <span className="label">Description</span>
                        <textarea className="input" name="description" id="descriptionInput" cols="50" rows="20" onChange={this.handleInputChange}/>
                    </div>
                    <div id='eventPic'>
                        <span className="label">Event picture</span>
                        <input className="input" name="pic" type="file" onChange={this.handlePicChange}/>
                    </div>
                </div>
            </div>    
        )
    }
}

export default Editevent