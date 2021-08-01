import React, { Component } from 'react'
import {Input, InputGroup } from 'reactstrap';
import { Link } from 'react-router-dom'
import './Login.css';
import dash from '../../assets/wordket.jpg';

class Login extends Component {

    constructor(props){
        super(props);
        this.state ={
            userName : "",
            password : ""
        }
    }

    componentDidMount() {
        document.title = 'Login';
      }

    onLogin(){
        
        if ( this.state.userName.trim() === "admin" && this.state.password.trim() === "admin" ){
            sessionStorage.setItem("loggedIn",true);
            //this.props.history.push("/home");
            window.location.href = "/home";
        }
    }

    render () {
        return (
            <div style={{height:'100vh', display:'flex'}}>
                <div style={{flex:'0.5',background:'white'}}>
                    <div style={{paddingTop:'30%'}}>
                        <div className="headerPanel" >
                            WordKet Admin
                        </div> 
                        <InputGroup>
                        <Input placeholder="User Name" onChange= {(e) => this.setState({userName : e.target.value})}/>
                        </InputGroup>
                        <br />
                        <InputGroup>
                        <Input  type="password" placeholder="Password" onChange= {(e) => this.setState({password : e.target.value})}/>
                        </InputGroup>
                        <br />
                        <div className="submitPanel" >
                        {/* <Link to="/home"> */}
                            <input className="loginButton" type="button" value="Submit" onClick={() => this.onLogin()}/>
                        {/* </Link> */}
                        </div>
                        
                    </div>
                </div>
                <div style={{flex:'0.5',background:'rgb(64, 220, 255)'}}>
                    <div style={{paddingTop:'34%'}}>
                        <div className="dashImage"><img src={dash} className="dashImgSrc" alt="Smiley face" height="250" width="450"/></div>
                        <div className="dashText">Provides exquisite writing and reading experience</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login 