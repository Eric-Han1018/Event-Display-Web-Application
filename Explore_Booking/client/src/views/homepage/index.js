import './index.css';
import React from 'react';
import Layout from 'layouts/pageLayout'
import Block from 'components/topBlock'

import { getEvent } from 'utils/exhibition';

class Home extends React.Component{

    constructor(props){
        super(props)
        this.changePage = this.changePage.bind(this)
        this.generateBoothBlock = this.generateBoothBlock.bind(this)
        this.getEventMeta = this.getEventMeta.bind(this)
        this.user = this.props.user
        this.state = {
            name: null,
            description: null,
            top_three: [],
            slogan: null,
            img: null
        }
    }

    changePage(){
        const params = window.location.href.split('/')
        const eventID = params[params.length - 1]
        window.location.href = "/explore/" + eventID
    }

    componentDidMount(){
        this.getEventMeta()
    }

    getEventMeta(){
        // Hard code, we will be getting these info from server.
        const params = window.location.href.split('/')
        const eventID = params[params.length - 1]
        getEvent(eventID, this)
    }

    generateBoothBlock (){
        const boothBlocks = this.state.top_three.map((booth)=>{
            return (
                <Block key={booth.boothId} topName={booth.name} img={booth.img?booth.img.image_url:null} boothId={booth.boothId}/>
            )
        }) 
        return boothBlocks.length? boothBlocks:(<div className="NoEventWarn">Currently there's no event</div>)
    }

    render(){

        return (
            <Layout user={this.props.user} app = {this.props.app}>
                <div className="homeBanner" id="homeBanner">
                    <div className="BannerContainer">
                        <div className="EventMetaContainer">
                            <div className="Theme">{this.state.slogan}</div>
                            <div className="Intro">{this.state.description}</div>
                            <button onClick={this.changePage}>Explore More</button>
                        </div>
                        <div className="TopThreeContainer">
                            <h1 className="Top3title">TOP Events:</h1>
                            <div className="top">
                                {this.generateBoothBlock()}
                            </div>
                        </div>
                    </div>
                    <img id="homeBannerPic" src={this.state.img?this.state.img.image_url:null} alt=""/>
                </div>
                <div id="HomePageInstruction">
                    Welcome to Explore and Booking System. <br/> 
                    Start your tour to {this.state.name} today by making your first appointment. <br/>
                    Feel free to 'Explore' !
                </div>
            </Layout>
        );
    }
}

export default Home