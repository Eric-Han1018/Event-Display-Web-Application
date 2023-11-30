import React from "react";
import './style.css'

class DropdownAppointment extends React.Component{

    curr_appointment = this.props
    
    goToAppointment(){
        const pageLink = this.curr_appointment.pageLink
        window.location.href = pageLink
    }

    render(){
        return (
            <div className="DropdownAppointment" onClick={this.goToAppointment.bind(this)}>
                <span className="DropdownNameAndTime">
                    <div className="appointedDropDownName">
                        {this.curr_appointment.boothName} {this.curr_appointment.status === 'book'? null : "(Waitlist)"}
                    </div>
                    <div className="appointedDropDownTime">
                        time: {this.curr_appointment.timeslot}
                    </div>
                </span>
                <span className="Arrow">
                    <svg height="30px" width="20px">
                        <line x1="10" y1="5" x2="20" y2="15"/>
                        <line x1="10" y1="25" x2="20" y2="15"/>
                    </svg>
                </span>
            </div>
        )
    }
}

export default DropdownAppointment