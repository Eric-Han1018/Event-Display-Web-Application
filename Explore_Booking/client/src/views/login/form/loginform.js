import React from "react";
import Button from "@material-ui/core/Button";
import Input from "./input.js";
import "./loginform.css";
import Password from "./password.js";
import logo from '../../../img/logos/themepark.svg'


class LoginForm extends React.Component {
    switchPage(){
        window.location.href = '/register'
    }
    render(){
        const {
            username, 
            password,
            handleChange,
            login
        } = this.props;
        return (
            <div className="background center">
                <div className="logo">
                    <img id="logoPic" src={logo} alt=""/>
                </div>
                <div className="loginform">
                    <Input
                        name="username"
                        value={username}
                        onChange={handleChange}
                        label="Username"
                    />
                    <br></br>
                    <Password
                        name="password"
                        value={password}
                        onChange={handleChange}
                        label="Password"
                    />
                    <div className="login_button">
                        <Button
                            variant="contained"
                            color="default"
                            className="submit_button"
                            onClick={login}
                        >
                            Log In
                        </Button>
                        <br></br>
                        <Button
                            variant="contained"
                            color="default"
                            className="submit_button"
                            onClick = {this.switchPage}
                        >
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginForm;