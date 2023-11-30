// Actions in user management list

import { adminRegister, deleteUserAPI } from "utils/user"

export function removeUser(userListComponent, deletingUserid){
    deleteUserAPI(userListComponent, deletingUserid)
}

export const addUser = userListComponent => {
    const newIdentity = userListComponent.state.newUserIdentity
    const newUserName = userListComponent.state.newUserName
    const newEmail = userListComponent.state.newUserEmail
    const newPassword = userListComponent.state.newUserPassword
    const newFullname = userListComponent.state.newUserFullName

    if(!newIdentity || !newUserName || !newEmail || !newPassword || !newFullname){
        userListComponent.setState({
            warnMsg: "Invalid input"
        })
    }

    if(newIdentity === 'manager' || newIdentity === 'admin' || newIdentity === 'user'){
        adminRegister(userListComponent, {
            userType: newIdentity, 
            username: newUserName, 
            email: newEmail, 
            password: newPassword, 
            fullname: newFullname})
    } else {
        console.log("Invalid Role")
    }

}

