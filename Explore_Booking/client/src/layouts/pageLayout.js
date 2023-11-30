import Header from "components/header";
import React from "react";
import './pageLayout.css'


class Layout extends React.Component{

    render(){
        return (
            <div className="OverallLayout">
                <Header user={this.props.user} app={this.props.app}></Header>
                {this.props.children}
            </div>
        )
    }
}

export default Layout