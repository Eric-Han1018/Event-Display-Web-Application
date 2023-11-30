import './style.css';
import React from 'react';
import Layout from "layouts/pageLayout"

import Block from 'components/boothBlock/index'
import { getEvent } from 'utils/exhibition';

class Explore extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            name: null, 
            description: null,
            booth_lst: [],
            slogan: null,
            brief: null,
            img: [],
            top_three: []
        }
    }

    componentDidMount(){
        const params = window.location.href.split('/')
        const eventID = params[params.length - 1]
        getEvent(eventID, this)
    }

    // Hard Code. We will be getting theme park or event meta from server
    sample_event = {
        theme: "Star Wars Park",
        slogan: "May the force be with you",
        intro: "A theme park that contains all star wars scenes!"
    }

    generateBoothBlock (){
        const boothBlocks = this.state.booth_lst.map((booth)=>{
            return (
                <Block 
                    identity={this.props.app.state.currentUser?this.props.app.state.currentUser.identity:null} 
                    key={booth._id} 
                    boothName={booth.name} 
                    boothIntro={booth.intro} 
                    boothId={booth._id} 
                    img={booth.img?booth.img.image_url:null} />
            )
        }) 
        return boothBlocks
    }

    render(){

        return (
            <Layout className="explore" user={this.props.app.state.currentUser} app = {this.props.app}>
                <div className="banner">
                    <img src={this.state.img?this.state.img.image_url:null} id="bannerPic" alt="" align="top"/>
                    <div className="Theme">{this.state.name}</div>
                    <div className="Intro">{this.state.brief}</div>
                </div>
                <h1 className="title">All Booths:</h1>
                <div className="subStations">
                    {this.generateBoothBlock()}
                </div>
            </Layout>
        )
    }
}

export default Explore