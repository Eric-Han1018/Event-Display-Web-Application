import React from "react";
import { checksession, getAppointments } from "utils/user";
import DropdownAppointment from "./Appointment";
import "./style.css"

class Dropdown extends React.Component{

    constructor(props){
        super(props)
        this.state= {
            currentUser: null,
            appointments: []
        }
    }

    componentDidMount(){
        checksession(this, ()=>{getAppointments(this, this.state.currentUser.userId)})
        console.log(this.state);
    }

    generateAppointmentBlocks(appointments){
        const appointmentBlocks = appointments.map((appointment)=>{
            return(<DropdownAppointment pageLink={"/BoothView/" + appointment.booth} 
                                        status={appointment.status}
                                        boothName={appointment.boothName}
                                        timeslot={appointment.time}
                                        key={appointment.booth}
                    />)
        })
        return appointmentBlocks
    }

    render(){

        return (
            <div className="dropdown">
                <button className="dropbtn">
                    Appointments
                </button>
                <div className="dropdown-content">
                    {this.generateAppointmentBlocks(this.state.appointments)}
                </div>
            </div>
        )
    }
}

export default Dropdown