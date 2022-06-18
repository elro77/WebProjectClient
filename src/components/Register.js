import {  Form, Button, Row,Col,Alert} from 'react-bootstrap'
import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
const sc=require("../services/serverCom.js");

var setNotefunc=()=>{}
var setNoteTextfunc=()=>{}
var setNoteVarfunc=()=>{}
var gSetUserNameFunc=()=>{}

var history=null

const onSuccess=(username)=>
{
  console.log("onSuccess")
  setNoteVarfunc("success")
  setNoteTextfunc("Registerd successfuly")
  setNotefunc(true)
  gSetUserNameFunc(username)
  setAuto(true)
  history.push("/Home")

}

const onFailure=()=>
{
  console.log("onFailure")
  setNoteVarfunc("warning")
  setNoteTextfunc("User exists")
  setNotefunc(true)
  setAuto(false)
}


var onSubmit=(event)=>{


  event.preventDefault();
  
  const form = event.currentTarget
  console.log("formGridUserName")
  console.log(form.formGridUserName.value)

  console.log("formGridPassword")
  console.log(form.formGridPassword.value)

  console.log("formGridPasswordAgain")
  console.log(form.formGridPasswordAgain.value)

  const username=form.formGridUserName.value
  const password=form.formGridPassword.value
  const PasswordAgain=form.formGridPasswordAgain.value
  if(password!==PasswordAgain ){
    setNoteTextfunc("Passwords dont match")
    setNoteVarfunc("warning")
    setNotefunc(true)
    return
  }
  if(username.length<4 || username.length>10){
    setNoteTextfunc("username lenght should be between 4 and 10")
    setNoteVarfunc("warning")
    setNotefunc(true)
    return
  }
  if(password.length<4 || password.length>10){
    setNoteTextfunc("Password lenght should be between 4 and 10")
    setNoteVarfunc("warning")
    setNotefunc(true)
    return
  }
  sc.register(username,password,onSuccess,onFailure)



}

const Register = ({ setAuto,setUserNameFunc }) => {
    let History = useHistory()
    history=History
    const [show, setShow] = useState(false);
    const [notificationText,setNotificationText]=useState("empty")
    const [notificationVariant,setNotificationVariant]=useState("warning")
    setNotefunc=setShow
    setNoteTextfunc=setNotificationText
    setNoteVarfunc=setNotificationVariant
    gSetUserNameFunc=setUserNameFunc;
    return (
      <div className='center'>
      <div className='formBorder'>
        <Form onSubmit={onSubmit}  >
        <h1 >
        Register
        </h1>

        <Alert show={show} variant={`${notificationVariant}`} >
              <Alert.Heading>Registration info</Alert.Heading>
              <p>
                {notificationText}
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
            <Form.Control type="username" placeholder="Choose your username" />
          </Form.Group>
      
          <Form.Group   controlId="formGridPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Choose your password" />
          </Form.Group>
          <Form.Group   controlId="formGridPasswordAgain">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm the chosen password" />
          </Form.Group>
        </Col>
      <Col>
        <Form.Group  controlId="button" >
        <Row>
          <Button type="submit" block>Register</Button>
        </Row>
      
          </Form.Group>
       </Col>
      </Form>
      </div>
      </div>
    )}

export default Register