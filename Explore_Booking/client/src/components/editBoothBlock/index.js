import React from "react";
import "./index.css"


class editBoothBlock extends React.Component{

    render (){
        return (
            <div>
                <div className = "booth_form">
                    <h2>{this.props.boothName} :</h2>
                    <label>New title</label>
                    <input type="text"/>
                    <label>New description</label>
                    <input type="text"/>
                    <label>New picture</label>
                    <input className="inputPicture" type="file"/>
                </div>
            </div>    
        )
    }
}

export default editBoothBlock