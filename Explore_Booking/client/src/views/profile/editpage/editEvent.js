import React from 'react';
import Layout from 'layouts/pageLayout';
import Button from "@material-ui/core/Button";
import './editEvent.css'
import Input from "views/booth/Input";
import {checksession} from 'utils/user';
import {postEditEvent} from 'utils/exhibition';


class editUser extends React.Component{

    constructor(props){
        super(props)
        const params = window.location.href.split('/')
        this.eventID = params[params.length - 1]
        this.state = {
            currentUser: null,
            name: null,
            brief: null,
            slogan: null,
            description: null,
            bannerimg: null
        }
        this.submit = this.submit.bind(this)
        this.switchPage = this.switchPage.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handlePicChange = this.handlePicChange.bind(this)
    }

    componentDidMount(){
        checksession(this, this.checkCorrectUser(this))
    }

    checkCorrectUser(comp){
        if (comp.state.currentUser && comp.state.currentUser.identity !== "admin") {
            window.location.href = '/chooseEvent'
        }
    }


    async submit(){
        let form = new FormData()
        form.append('name', this.state.name)
        form.append('brief', this.state.brief)
        form.append('slogan', this.state.slogan)
        form.append('description', this.state.description)
        form.append('bannerimg', this.state.bannerimg)
        postEditEvent(this, form, this.eventID)
    }

    switchPage(){
        window.location.href = '/profile/' + this.state.currentUser.userId
    }
    
    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handlePicChange(event){
        const target = event.target
        const name = target.name
        const value = target.files[0]
        this.setState({
            [name]:value
        })
    }

    render(){
        return (
            <Layout user={this.props.app.state.currentUser} app={this.props.app}>
            <div className="eventContainer">
            <div className = 'editEventPage'>
                <h1 id='h1_edit'>Edit Event:</h1>
                <h2 id='editTitle'>Edit your event below :</h2>
                <div id="editEventContainer">
                    <label className="editEventLabel">New Eventname</label>
                    <div className="editEventInput">
                        <Input type="text" name="name" onChange={this.handleInputChange}/>
                    </div>
                    <label className="editEventLabel">New Event picture</label>
                    <input id='EventPicture' name="bannerimg" type="file" onChange={this.handlePicChange}/>
                    <label className="editEventLabel">New Brief</label>
                    <div className="editEventInput">
                        <Input type="text" name="brief" onChange={this.handleInputChange}/>
                    </div>
                    <label className="editEventLabel">New Slogan</label>
                    <div className="editEventInput">
                        <Input type="text" name="slogan" onChange={this.handleInputChange}/>
                    </div>
                    <label className="editEventLabel">New Description</label>
                    <div className="editEventInput">
                        <Input type="text" name="description" onChange={this.handleInputChange}/>
                    </div>
                </div>
                <div id="Warning Msg">{this.state.warningMsg}</div>
                <div className = 'editEventPageButton'>
                    <Button
                        variant="contained"
                        color="default"
                        className="edit_Event_button"
                        onClick = {this.submit}
                        >
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        color="default"
                        className="edit_Event_button"
                        onClick = {this.switchPage}
                        >
                        Back
                    </Button>
                </div>
            </div>
            </div>
            </Layout>
        );
    }
}
export default editUser