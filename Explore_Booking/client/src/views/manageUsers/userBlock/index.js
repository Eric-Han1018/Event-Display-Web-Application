import React from "react";
import './style.css'

import {removeUser} from '../actions'

class UserBlock extends React.Component{

    render(){

        const userListComp = this.props.userListComponent
        const user = this.props.user
        return (
            <div className="userBlock">
                <div className="UserInfoCol">{user.userId}</div>
                <div className="UserInfoCol">{user.userName}</div>
                <div className="UserInfoCol">{user.identity}</div>
                <div className="UserInfoCol">
                    <button className="Operation" onClick={()=>removeUser(userListComp, user.userId)}>delete</button>
                </div>
            </div>
        )
    }

}

export default UserBlock