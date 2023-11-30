import React from 'react';
import Layout from 'layouts/pageLayout';
import Button from "@material-ui/core/Button";
import './editBooth.css'
import Input from "views/booth/Input";
import {checksession} from 'utils/user';
import {postEditBooth} from 'utils/booth';

class editBooth extends React.Component{

    constructor(props){
        super(props)
        const params = window.location.href.split('/')
        this.boothId = params[params.length - 1]
        this.state = {
            currentUser: null,
            name: null,
            description: null,
            pic: null
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
        if (comp.state.currentUser && comp.state.currentUser.identity !== "manager") {
            window.location.href = '/chooseEvent'
        }
    }

    async submit(){
        let form = new FormData()
        form.append('name', this.state.name)
        form.append('description', this.state.description)
        form.append('pic', this.state.pic)
        postEditBooth(this, form, this.boothId)
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

    switchPage(){
        window.location.href = '/profile/' + this.state.currentUser.userId
    }

    render(){
        return (
            <Layout user={this.props.app.state.currentUser} app={this.props.app}>
            <div className="editBoothContainer">
            <div className = 'editBoothPage'>
                <h1 id='h1_edit'>Edit Booth:</h1>
                <h2 id='editTitle'>Edit your booth below :</h2>
                <div id="editEventContainer">
                    <label className="editEventLabel">New Booth name</label>
                    <div className="editEventInput">
                        <Input type="text" name="name" onChange={this.handleInputChange}/>
                    </div>
                    <label className="editEventLabel">New Description</label>
                    <div className="editEventInput">
                        <Input type="text" name="description" onChange={this.handleInputChange}/>
                    </div>
                    <label className="editEventLabel">New Booth picture</label>
                    <ul></ul>
                    <input id='EventPicture' name="pic" type="file" onChange={this.handlePicChange}/>
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
export default editBooth