import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import { bookAppointment } from "../../../utils/user";
import "./styles.css";
import { removeTimeAPI } from "utils/booth";

class TimeSlotForm extends React.Component {
  
  removeTimeSlot(time, booth){
    console.log("removing Time Slot")
    console.log(time, booth);
    removeTimeAPI(this, {
        time: time
    }, booth)
};

  checkCurrentAppointment(props){
    console.log(props.timePeriod);
    if(!props.currentBooking){
      return false
    }else{
      return true
    }
  }

  generateButton(props){
    const { timePeriod, queueComponent, user, boothId } = props;
    if(!user || user.identity === 'admin'){
      return 
    } else if (user.identity === 'manager'){
      return (
        <Button
            variant="contained"
            onClick={() => this.removeTimeSlot(timePeriod, boothId)}>
            Remove!
        </Button>
      )
    } else { // user.identity === 'user'
      return (
        <Button
            variant="contained"
            onClick={() => bookAppointment(queueComponent, {timePeriod: timePeriod}, boothId, user.userId)}
            disabled={this.checkCurrentAppointment(this.props)}>
            Book it!
        </Button>
      )
    }
  }

  render() {
    const { timePeriod, avaliableSpots } = this.props;
    return (
      <TableRow className="timeRow">
        <TableCell component="th" scope="row" align='center'>
            {timePeriod}
        </TableCell>

        <TableCell component="th" scope="row" align='center'>
            {avaliableSpots}
        </TableCell>

        <TableCell component="th" scope="row" align='center'>
          <Grid
            className="timeslot_button-grid">
            {this.generateButton(this.props)}
          </Grid>
        </TableCell>
      </TableRow>
    );
  }
}

export default TimeSlotForm;
