import React from "react";
import Layout from "layouts/pageLayout"
import Button from "@material-ui/core/Button";
import Input from "./Input";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";    
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TimeSlotForm from "./TimeSlotForm";
import { cancelAppointment, addNewComment} from "./actions/queue";
import CommentBlock from "./CommentBlock";
import "./BoothView.css";
import {addTimeSlot, getBoothInfo, setAllComments} from "../../utils/booth"
import { checksession, getAppointmentOfBooth } from "utils/user";

function switchToProfile(userid){
    window.location.href = '/profile/'+userid
}

class BoothView extends React.Component {
    
    // HardCoding, we will get actrual metadata from server. 
    // In the same way, when managers and admins edit info, 
    // the new info will go to server first so that we will only need to fetch data here


    constructor(props){
        super(props)
        this.state = {
            currentUser: null,
            boothId: null,
            name:"",
            eventid: 0,
            commentCount: 0,
            comments: [],
            timeSlot: [],
            description: "",
            capacity: 0,
            img: null,
            manager: "",
            CurrentCommentUserName: "",
            CurrentCommentUserIcon: "",

            userid:"61a953f957eb879278b8ad8b",
            username: "",
            userProfileIcon: "",
            newCommentContent: "",
            newTime: "",
            newWaitlist: "",
            currentAppointment: null
        };
        this.handleInputChange = this.handleInputChange.bind(this)
        this.addNewTimeSlot = this.addNewTimeSlot.bind(this)
        this.descriptionMessage = this.descriptionMessage.bind(this)
    }

    componentDidMount(){
        const params = window.location.href.split('/')
        const boothId = params[params.length - 1]
        checksession(this, ()=>{getAppointmentOfBooth(this, boothId, this.state.currentUser.userId)})
        getBoothInfo(boothId, this)
        console.log("gonna set comments")
        console.log(this.state)
        setAllComments(this, boothId)
        console.log("Set comments Done")
        console.log(this.state);
        this.setState({boothId: boothId})
    }

    addNewTimeSlot(){
        const params = window.location.href.split('/')
        const boothId = params[params.length - 1]
        console.log("adding Time Slot");
        console.log(this.state.newTime)
        const bag = {
            capacity: this.state.capacity,
            time: this.state.newTime
        }
        addTimeSlot(this, bag, boothId)
    };

    // Generic handler for whenever we type in an input box.
    // We change the state for the particular property bound to the textbox from the event.
    handleCommentInputChange = event => {
        const target = event.target;
        const value = target.value;
        this.setState({
            newCommentContent: value
        });
    };

    handleInputChange = event => {
        const target = event.target;
        const name = target.name
        const value = target.value;
        this.setState({
            [name]: value
        });
    };


    generateAddTimeSlot(currentUser){
        if(currentUser && currentUser.identity === 'manager'){
            return (
            <TableRow className="timeSlotHeader">
                <TableCell component="th" scope="row" align='center'>
                    <input type="text" 
                        placeholder="New Time Slot"
                        name='newTime'
                        onChange={this.handleInputChange}
                    />
                </TableCell>
                <TableCell component="th" scope="row" align='center'>
                    
                </TableCell>
                <TableCell component="th" scope="row" align='center'>
                    <Button
                        variant="contained"
                        size='large'
                        align='center'
                        onClick={this.addNewTimeSlot}
                    >
                        ADD!     
                    </Button>
                </TableCell>
            </TableRow>)
        }
    }

    generateBoothIntro(){
        return (
            <div id='BoothBasicInfo'>
                <h3> Know more about us! </h3>
                <div id='introduction'>
                    <span> {this.state.description} </span>
                </div>
            </div>
        )
    }

    descriptionMessage = function(){
        console.log(this.state);
        if(!this.props.app.state.currentUser){
            return 
        }
        if(this.props.app.state.currentUser.identity !== 'user'){
            return
        }
        if (this.state.currentAppointment) {
            return (
            <div className="CurrentStatus">
                <span> You have booked {this.state.currentAppointment.boothName} on {this.state.currentAppointment.time} </span>
                <span className="CancelButton">
                    <Button
                        id='BoothViewCancelAppointment'
                        variant="contained"
                        size='large'
                        align='center'
                        onClick={() => cancelAppointment(this, this.state.boothId, this.state.currentUser.userId, this.state.currentAppointment.time)}>
                        Cancel Appointment
                    </Button>
                </span>
            </div>
            )
        } else {
            return <div className="CurrentStatus"> You haven't make any appointment yet </div>
        }
    }

    generateCommentBlock(currentUser){
        const comments = this.state.comments
        const component = this
        if(currentUser === null || currentUser === undefined){
            return (
                <div id='commentsContainer'>
                    <h3> Comments </h3>
                    {this.state.comments.map(function(comment){
                        return (
                            <div className='comment'>
                                <div className = 'userIconContainer' onClick={()=>switchToProfile(comment.user)}>
                                    <img className ='userIcon' alt="" src={comment.userIcon? comment.userIcon: null} />
                                </div>
                                <div className = 'commentContentContainer'>
                                    <p className = 'userName'>{comment.userName}</p>
                                    <p className = 'userComment'>{comment.comment}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )
        }   

        const identity = currentUser.identity
        if(identity === 'admin'){
            return (
                <div id='commentsContainer'>
                    <h3> Comments </h3>
                    {comments.map(function(comment){
                        return (
                            <CommentBlock comment={comment} commentList={component}/>
                            );
                        })}
                </div>
            )
        } else if (identity === 'manager') {
            return (
                <div id='commentsContainer'>
                    <h3> Comments </h3>
                    {this.state.comments.map(function(comment){
                        return (
                            <div className='comment'>
                                <div className = 'userIconContainer' onClick={()=>switchToProfile(comment.user)}>
                                    <img className ='userIcon' alt='' src={comment.userIcon? comment.userIcon: null} />
                                </div>
                                <div className = 'commentContentContainer'>
                                    <p className = 'userName'>{comment.userName}</p>
                                    <p className = 'userComment'>{comment.comment}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )
        } else { // user!!!
            return (
                <div id='commentsContainer'>
                    <h3> Comments </h3>
                    {this.state.comments.map(function(comment){
                        return (
                            <div className='comment'>
                                <div className = 'userIconContainer' onClick={()=>switchToProfile(comment.user)}>
                                    <img className ='userIcon' alt='' src={comment.userIcon? comment.userIcon: null} />
                                </div>
                                <div className = 'commentContentContainer'>
                                    <p className = 'userName'>{comment.userName}</p>
                                    <p className = 'userComment'>{comment.comment}</p>
                                </div>
                            </div>
                            );
                        })}
                </div>
            )
        }
    }

    render() {
        const app = this.props.app
        return (
            <Layout user={app.state.currentUser} app ={app}>
                <div id='userBoothView'>
                    <div id="boothBanner">
                        <img id="boothBannerPic" src={this.state.img?this.state.img:null} alt=''/>
                        <div className="boothName">{ this.state.name }</div>
                        <div className="waitlist">Capacity: { this.state.capacity }</div>
                    </div>

                    <div id="userBoothEverything">
                        <div className='halfHalfContainer'>
                            {this.generateBoothIntro(app.state.currentUser)}
                        </div>
                        <div className='UpperParts'>
                            <div className='halfHalfContainer'>
                                {this.generateCommentBlock(app.state.currentUser)}
                                {(this.props.app.state.currentUser && this.props.app.state.currentUser.identity === 'user')? (<div className="newCommentBlock">
                                    <h3>Write your comment here:</h3>
                                    <Input type="text" 
                                        //    className="form-control" 
                                        placeholder="Please write your comments" 
                                        value={this.state.newCommentContent}
                                        onChange={this.handleCommentInputChange}/>
                                    <Grid className="Comments-grid">
                                        <Button
                                            variant="contained"
                                            onClick={() => addNewComment(this)}
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                </div>): null}
                            </div>
                        </div>
                        <div id='timeslots'>
                            <h3> Time Slots: </h3>
                            <div className='timeSlotsTableContainer'>
                                <Table>
                                    <TableHead>
                                        <TableRow className="timeSlotHeader">
                                            <TableCell component="th" scope="row" align='center'>
                                                Time
                                            </TableCell>
                                            <TableCell component="th" scope="row" align='center'>
                                                Avaliable Spots
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.timeSlot.map(row => (
                                            <TimeSlotForm
                                                key={row.time}
                                                timePeriod={row.time}
                                                avaliableSpots={row.availability!==0?row.availability:"(waitlist)"+row.waitlist.length}
                                                queueComponent={this}
                                                user={app.state.currentUser}
                                                currentBooking = {this.state.currentAppointment}
                                                boothId={this.state.boothId}/>
                                            )
                                        )}
                                        {this.generateAddTimeSlot(app.state.currentUser)}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                        {this.descriptionMessage()}
                    </div>
                </div>
            </Layout>
        );
    }
}

export default BoothView;
