import React from "react";
import './style.css'

import Layout from "layouts/pageLayout";
import UserBlock from "./userBlock";
import { addUser } from "./actions";
import { getAllUsers } from "utils/user";

class ManageUsers extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            newUserName: '',
            newUserIdentity: '',
            newUserEmail: '',
            newUserPassword: '',
            newnewUserFullName: '',
            // so that currently we directly use lengh of array + 1.
            users: [],
            warnMsg: null
        }
        this.inputChange = this.inputChange.bind(this)
    }

    inputChange = event => {
        const target = event.target
        const value = target.value
        const name = target.name
    
        this.setState({
            [name]: value
        })
    }

    async componentDidMount(){
        getAllUsers(this)
    }

    back(){
        window.history.back()
    }

    getUsers(){
        return (
            <div id="allUsersList">
                {console.log(this.state)}
                {this.state.users.map((user)=>{
                    console.log(user);
                    return (<UserBlock key={user.userId} user={user} userListComponent={this}/>)
                })}
            </div>
        )
    }

    render(){
        return (
            <Layout user={this.props.app.state.currentUser} app={this.props.app}>
                <div className="manageUsersContainer">
                    <div className="manageUsers">
                        <h1>Current Users</h1>
                        <span className="warning">{this.state.warnMsg}</span>
                        <div className="AdminCreateUser">
                        <input name="newUserName" className="NewUserInput" placeholder="NewUser" onChange={this.inputChange}/>
                        <input name="newUserIdentity" className="NewUserInput" placeholder="Identity" onChange={this.inputChange}/>
                        <input name="newUserEmail" className="NewUserInput" placeholder="email" onChange={this.inputChange}/>
                        <input name="newUserFullName" className="NewUserInput" placeholder="fullname" onChange={this.inputChange}/>
                        <input name="newUserPassword" className="NewUserInput" type="password" placeholder="password" onChange={this.inputChange}/>
                        <button className="Operation" onClick={()=>addUser(this)}>Create User</button>
                        </div>
                        <br/>
                        <div id="userTableTitle">
                            <div className="titleRow">UserID</div>
                            <div className="titleRow">UserName</div>
                            <div className="titleRow">Identity</div>
                            <div className="titleRow">Operations</div>
                        </div>
                        {this.getUsers()}
                        <button className="BackButton" onClick={this.back}>Back</button>
                    </div>
                </div>
            </Layout>
        )
    }

}

export default ManageUsers