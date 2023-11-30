import Layout from "layouts/pageLayout";
import React from "react";
import './style.css'

import Form from './BoothForm'
import { checksession } from "utils/user";
import { addBooth } from "utils/booth";

class CreateBooth extends React.Component{

    constructor(props){
        super(props)
        this.submitBooth = this.submitBooth.bind(this)
        this.switchPage = this.switchPage.bind(this)
        this.state = {
            currentUser: null,
            name: null,
            event: null,
            intro: null,
            description: null,
            pic: null,
            capacity: null,
            invalidInfo: null
        }
    }

    componentDidMount(){
        checksession(this, ()=>{this.checkIdentity(this.state)})
    }

    checkIdentity(state){
        if(!state.currentUser || state.currentUser.identity !== 'manager'){
            window.history.back()
        }
    }

    switchPage(){
        window.location.href = '/profile/' + this.state.currentUser.userId
    }

    async submitBooth(){
        console.log(this.state);
        let form = new FormData()
        form.append('creator', this.state.currentUser.userId)
        form.append('name', this.state.name)
        form.append('event', this.state.event)
        form.append('description', this.state.description)
        form.append('intro', this.state.intro)
        form.append('capacity', this.state.capacity)
        form.append('pic', this.state.pic)
        addBooth(this, form)
    }

    render(){
        return (
            <Layout user={this.props.app.state.currentUser} app={this.props.app}>
                <div id="FormContainer">
                    <Form callingComp={this}/>
                    <div>
                        <button
                            className="create_Booth_button"
                            onClick = {this.submitBooth}>
                            Submit
                        </button>
                        <button
                            className="create_Booth_button"
                            onClick = {this.switchPage}>
                            Back
                        </button>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default CreateBooth