import React from "react";
import "./index.css"
import Input from "views/booth/Input";


class editExhibitionBlock extends React.Component{

    render (){

        
        return (
            <div>
                <div className = "exhibition_form">
                    <h2>{this.props.exhibitionName} :</h2>
                    <label className='editEventLabel'>New title</label>
                    <Input type="text"/>
                    <label className='editEventLabel'>New description</label>
                    <Input type="text"/>
                    <label className='editEventLabel'>New picture</label>
                    <input id="eventFIle" type="file"/>
                </div>
            </div>    
        )
    }
}

export default editExhibitionBlock