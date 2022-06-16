//import React from 'react'
import Login from './components/LogIn'
import Register from './components/Register'
import Navigator from './components/Navigator'
//import Home from './components/Home'
import Home from './components/Home'
import ProjectWindow from './components/ProjectWindow'
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";




const App = (props) => {

  const [Authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userProjects, setUserProjects] = useState([]);
  const [projectJson, setProjectJson] = useState([]);

  return(

    <div>
    
    <Router>    
    <Navigator></Navigator>
        <Switch>
         
        <Route exact path="/Login">
          <Login setAuto={setAuthenticated} setUserNameFunc = {setUserName} setUserProjectsFunc = {setUserProjects}/>
        </Route>  
      
        <Route path="/Home" render={()=>{
          if(Authenticated)
          {
            return(<Home userName={userName} userProjects = {userProjects} setProjectJson = {setProjectJson}/>)
          }
            
          else
          {
            return <Redirect to="/"/>
          }    
          
          }}></Route>
        <Route path="/ProjectWindow" render={()=>{
          if(Authenticated )
          {
            return(<ProjectWindow userName={userName} projectJson={projectJson} />)
          }
            
          else
          {
            return <Redirect to="/"/>
          }
 
          }}></Route>
        <Route path="/Register" render={()=>{return(<Register setUserNameFunc={setUserName}/>)}}></Route>
        <Route path="/" ><Redirect to="/Login"/></Route>
          
      </Switch>
    </Router>

    </div>
    
    )
  
}

export default App