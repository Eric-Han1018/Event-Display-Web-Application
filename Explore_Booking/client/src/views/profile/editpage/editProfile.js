
import React from 'react';
import Layout from 'layouts/pageLayout';
import Button from "@material-ui/core/Button";
import './editProfile.css'
import Input from "views/booth/Input";
import { checksession, postEditProfile } from 'utils/user';


class editUser extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            currentUser: null,
            userName: null,
            email: null,
            phone: null,
            pic: null
        }
        this.submit = this.submit.bind(this)
        this.switchPage = this.switchPage.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handlePicChange = this.handlePicChange.bind(this)
    }
    componentDidMount(){
        const params = window.location.href.split('/')
        const userID = params[params.length - 1]
        checksession(this, this.checkCorrectUser(this, userID))
    }

    checkCorrectUser(comp, userID){
        if (comp.state.currentUser && comp.state.currentUser.userId !== userID) {
            window.location.href = '/chooseEvent'
        }
    }

    async submit(){
        let form = new FormData()
        form.append('userName', this.state.userName)
        form.append('email', this.state.email)
        form.append('phone', this.state.phone)
        form.append('pic', this.state.pic)
        postEditProfile(this, form, this.state.currentUser.userId)
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
            <div className="profileContainer">
            <div className = 'editProfilePage'>
                <h1 id='h1_edit'>Edit Profile:</h1>
                <h2 id='editTitle'>Edit your profile below :</h2>
                <div id="editProfileContainer">
                    <label className="editProfileLabel">New Username</label>
                    <div className="editProfileInput">
                        <Input type="text" name="userName" onChange={this.handleInputChange}/>
                    </div>
                    <label className="editProfileLabel">New profile picture</label>
                    <input id='profilePicture' name="pic" type="file" onChange={this.handlePicChange}/>
                    <label className="editProfileLabel">New Email</label>
                    <div className="editProfileInput">
                        <Input type="text" name="email" onChange={this.handleInputChange}/>
                    </div>
                    <label className="editProfileLabel">New Phone</label>
                    <div className="editProfileInput">
                        <Input type="text" name="phone" onChange={this.handleInputChange}/>
                    </div>
                </div>
                <div id="Warning Msg">{this.state.warningMsg}</div>
                <div className = 'editProfilePageButton'>
                    <Button
                        variant="contained"
                        color="default"
                        className="edit_profile_button"
                        onClick = {this.submit}
                        >
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        color="default"
                        className="edit_profile_button"
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