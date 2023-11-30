import React from "react";
import Button from "@material-ui/core/Button";
import "./register.css";
import registerPic from "../../img/register/register.jpeg"
import {register} from "utils/user"

class Register extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            fullname: "",
            username: "",
            email:"",
			password: "",
			userType: null,
			message: null
        };
		this.register = this.register.bind(this)
    }

	handleInputChange = event => {
        const target = event.target;
        var value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

	register(){
		console.log(this.state);
		register(this)
        //window.location.href = '/login'
    }

	getWelcomeWord(){
		// Hard code. It can be edited by admin
		// return "Welcome, young Skywalker"
		return "Welcome to explore our theme park !"
	}
	
	componentDidMount(){
        document.getElementById("registerPic").style.backgroundImage = "url("+registerPic+")"
    }
	

	render(){
    	return (
			<div className="register" id = "registerPic">
				<h2 className="h2_header">{this.getWelcomeWord()}</h2>
				<form id = "main_form">

					<div className="register_form">
						<p className="Registermessage">
						{this.state.message}
						</p>
						<label className='register_label'>Full Name </label>
						<input type="text" className="form-control" placeholder="Full name" name="fullname" onChange={this.handleInputChange}/>
						<label className='register_label'>Username</label>
						<input type="text" className="form-control" placeholder="User name" name="username" onChange={this.handleInputChange}/>
						<label className='register_label'>Email</label>
						<input type="email" className="form-control" placeholder="Enter email" name="email" onChange={this.handleInputChange}/>
						<label className='register_label'>Password</label>
						<input type="text" className="form-control" placeholder="Enter password" name="password" onChange={this.handleInputChange}/>
						<label className='register_label'>Usertype</label>
						<select className="form-control" name="userType" defaultValue="" onChange={this.handleInputChange}>
						<option className="selection" value="" disabled>Select type</option>
						<option className="selection" value = "user" >User</option>
						<option className="selection" value ="manager">Manager</option>
						</select>
					</div>

					<Button
						variant="contained"
						color="default"
						className="register_button"
						onClick = {this.register}
						>
						Register
					</Button>
				</form>
			</div>
		);
	}
}

export default Register;