import {  Navbar, Nav,NavDropdown } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import React, { useState } from 'react';
export let SetUser
let history = null
const Navigator = () => {
  let History = useHistory()
    history= History
    // ...
    const [user, setUser] = useState({name:"guest",isLog:false});
    
    SetUser=setUser
    let dropDown=null;
    let navHome = null;
    function logOut(){
      setUser({name:"guest",isLog:false})
      History.replace("/LogIn") 
       
    }
    if (user.isLog){
      dropDown=<NavDropdown title={user.name} id="basic-nav-dropdown">
         <NavDropdown.Item onClick={logOut}>Logout</NavDropdown.Item>
      </NavDropdown>
      navHome = <Nav.Link onClick={()=>{History.replace("/Home")}}>Home</Nav.Link>
    }
     
    return (
        <Navbar bg="light" expand="lg">  
          <Navbar.Brand>Working on it!</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            {navHome}
            {dropDown}
            </Nav>
            
          </Navbar.Collapse>
        </Navbar>
    )}
export default Navigator
