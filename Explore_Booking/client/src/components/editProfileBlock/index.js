import React from "react";
import "./index.css"
import Input from "views/booth/Input";


class editProfileBlock extends React.Component{

    render (){

        
        return (
            <div>
                <div className = "profile_form">
                    <h2>{this.props.Edit} :</h2>
                    <label className="editProfileLabel">New Username</label>
                    <Input type="text"/>
                    <label className="editProfileLabel">New profile picture</label>
                    <input id='profilePicture' type="file"/>
                    <label className="editProfileLabel">New Email</label>
                    <Input type="text"/>
                    <label className="editProfileLabel">New Phone</label>
                    <Input type="text"/>
                </div>
            </div>    
        )
    }
}

export default editProfileBlock