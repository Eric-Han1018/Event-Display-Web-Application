import Layout from "layouts/pageLayout";
import React from "react";
import './style.css'

import Form from './eventForm'
import { checksession } from "utils/user";
import { addEvents } from "utils/exhibition";

class CreateEvent extends React.Component{

    constructor(props){
        super(props)
        this.submitEvent = this.submitEvent.bind(this)
        this.switchPage = this.switchPage.bind(this)
        this.state = {
            name: null,
            slogan: null,
            description: null,
            pic: null,
            invalidInfo: null
        }
    }

    componentDidMount(){
        checksession(this, ()=>{this.checkIdentity(this.state)})
    }

    checkIdentity(state){
        if(!state.currentUser || state.currentUser.identity !== 'admin'){
            window.history.back()
        }
    }

    switchPage(){
        window.location.href = '/profile/' + this.state.currentUser.userId
    }

    async submitEvent(){
        let form = new FormData()
        form.append('name', this.state.name)
        form.append('description', this.state.description)
        form.append('slogan', this.state.slogan)
        form.append('pic', this.state.pic)
        addEvents(this, form)
    }

    render(){
        return (
            <Layout user={this.props.app.state.currentUser} app={this.props.app}>
                <div id="FormContainer">
                    <Form callingComp={this}/>
                    <div className="Warning">{this.state.invalidInfo}</div>
                    <div>
                        <button
                            className="create_event_button"
                            onClick = {this.submitEvent}>
                            Submit
                        </button>
                        <button
                            className="create_event_button"
                            onClick = {this.switchPage}>
                            Back
                        </button>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default CreateEvent