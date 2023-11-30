import React from "react";
import LoginForm from "./form/loginform"
import {login} from 'utils/user'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            type:""
        };
        this.verify = this.verify.bind(this)
    }

    // // This calls the parent function to change global status

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    verify= () => {
        login({
            username: this.state.username, 
            password: this.state.password
        }, this.props.app)
    }
    

    render(){
        // const {
        //     updateUser
        // } = this.props;
        return(
            <div>
                <LoginForm
                    username = {this.state.username}
                    password = {this.state.password}
                    handleChange={this.handleInputChange}
                    login = {()=>this.verify()}
                />
            </div>
        )
    }
}


export default Login;