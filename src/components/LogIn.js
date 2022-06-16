import {  Form, Button,Row,Col,Alert} from 'react-bootstrap'
import React, { useState } from 'react'
import { useHistory} from "react-router-dom";
const sc=require("../services/serverCom.js");

var setNotefunc=()=>{}
var setAutofunc=()=>{}
var gSetUserNameFunc=()=>{}
var gSetUserProjectsFunc=()=>{}


var history=null
const onSuccess=(username, userProjects)=>
{
  console.log("LogIn: onSuccess")
  setAutofunc(true)
  gSetUserNameFunc(username);
  gSetUserProjectsFunc(userProjects);
  history.push("/Home")
}

const onFailure=()=>
{
  console.log(onFailure)
  setNotefunc(true)
}

const onSubmit=(event)=>
{
  event.preventDefault();
  
  const form = event.currentTarget
  console.log("formGridUserName")
  console.log(form.formGridUserName.value)

  console.log("formGridPassword")
  console.log(form.formGridPassword.value)

  const username=form.formGridUserName.value
  const password=form.formGridPassword.value

  
  sc.signIn(username,password,onSuccess,onFailure)


  form.formGridUserName.value=""
  form.formGridPassword.value=""
  
}





const LogIn = ({ setAuto, setUserNameFunc ,setUserProjectsFunc}) => {
    // ...
    let History = useHistory()
    history=History
    const [show, setShow] = useState(false);
    setNotefunc=setShow;
    setAutofunc=setAuto;
    gSetUserNameFunc = setUserNameFunc;
    gSetUserProjectsFunc = setUserProjectsFunc;
    return (
        <div  className="center" >
        <div className='formBorder'>
        <Form onSubmit={onSubmit}>
          <h1>
          Log In
          </h1>
          <Alert show={show} variant="warning">
                <Alert.Heading>Log in failed</Alert.Heading>
                <p>
                username or password incorrect
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={() => setShow(false)} variant="outline-warning">
                    Close
                  </Button>
                </div>
              </Alert>
              
          <Col>
            <Form.Group   controlId="formGridUserName">
              <Form.Label>Username</Form.Label>
              <Form.Control type="username" placeholder="Enter username" />
            </Form.Group>

            <Form.Group   controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
          </Col>
        <Col>
          <Form.Group  controlId="button" >
          <Row>
              <Col>
                  <Button type="submit" block>Sign in</Button>
              </Col>
          </Row>
          <Row>
          <Col >
            <div className='right'>
            <a href="/Register" >Create User</a>            
            </div>
          </Col>
          </Row>
            </Form.Group>
        </Col>
        </Form>
        </div>
        </div>
      
  )}


  export default LogIn