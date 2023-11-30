import Layout from "layouts/pageLayout";
import React from "react";
import './NotFound.css'

class NotFound extends React.Component{
    render(){
        return (
            <Layout user={this.props.app.state.currentUser} app={this.props.app}>
                <h1 className="NotFound">404. Cannot find the page you are looking for.</h1>
            </Layout>
        )
    }
}

export default NotFound