import { Card, Form, Button, Container, Row, Col, Modal } from 'react-bootstrap'
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
const sc=require("../services/serverCom.js");

var history=null

const Home = ({ userName, userProjects, setProjectJson}) => {
    let History = useHistory()
    history=History



  
    const [formValidated, setFormValidated] = useState(false);
    const [m_userName, setUserName] = useState(userName)
    const [show, setShow] = useState(false);

    var projectToJson =[]
    if(userProjects.length !== 0)
        projectToJson = JSON.parse(userProjects)

    const [projectsList, setProjcetList] = useState(projectToJson);

    const goToProject =(projectID) =>{

        console.log("open clicked")
        // setProjectJson = projectsList[projectIndex]
        console.log(projectID)
        for(var i = 0; i<projectsList.length; i++)
        {
            if(projectsList[i]._id === projectID)
            {
                console.log(projectsList[i])
                setProjectJson(projectsList[i])
                break
            }      
        }
        
        history.push("/ProjectWindow")


    }


    const onAddProjectSuccess = (projectJson) =>{
        console.log("Home2 onAddProjectSuccess") 
        console.log(projectJson)
        console.log(typeof projectJson)
        var projectToJson = JSON.parse(projectJson)
        //add project to projects list
        const newList = [...projectsList, projectToJson];
        // console.log(newList);
        setProjcetList(newList);
        // console.log(projectsList);
    }

    const onAddProjectFailed = () =>{
        //Notify User
        console.log("project failed to add")
        alert('such project already exists!');
    }

    const handleClose = () => 
    {
        setFormValidated(false);
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const addProject = () => 
    {
        handleShow();
    }

    const addProjectToDB = (user,projectName, projectDesc) =>{
        console.log("addProjectToDB")
        sc.addProject(user,projectName,projectDesc,projectsList, onAddProjectSuccess, onAddProjectFailed);
    }

    const submitProject = (event)=>
    {
   
        event.preventDefault();
        const form = event.currentTarget
        const projectName = form.projectName.value
        const projectDesc = form.projectDescription.value
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setFormValidated(true);
        }
   
        else
        {     
            handleClose();


            addProjectToDB(userName,projectName, projectDesc)

            //add project to dataBase
            

        }

  
    }
    //read projcets of user
    return (    
        <div >
        <div className="home" >
            <div className="labelStyle" >Hello, {m_userName}</div>
        </div>
        <div className="center">
            <div>
                <div id="projectName" className="labelStyle">My Projects</div>
                <Button variant="outline-success" onClick={addProject} >Add Project</Button>
                <hr></hr>
                
            </div>

            {/* Projcets Grid*/}
            <Container className='ProjctsGrid'>  
                {projectsList.map(({ _id,projectName, creator, projectDesc, time}) => (
                    <Row key = {"row" + {_id}}>
                    <Col key = {"col" + {_id}}>
                        <Card key = {_id}>
                            <Card.Header>Owner: {creator}</Card.Header>
                            <Card.Body>
                                <Card.Title style={{fontSize:26}}>{projectName}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted" style={{fontSize:14}} >Created in: {time}</Card.Subtitle>
                                <Card.Text style={{fontSize:20}}>
                                {projectDesc}
                                </Card.Text>
                                <Button variant="primary" onClick={() => goToProject(_id)}>Open</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    </Row> 
                ))}    
            </Container>


            {/* Adding Projcet Form*/}
            <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Form noValidate validated={formValidated} onSubmit={submitProject}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        {/* ProjectName */}
                        <Form.Group controlId="projectName">
                            <Form.Label>Projcet Name</Form.Label>
                            <Form.Control required type="text" placeholder={"Insert Name"} />
                            <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                            Please enter a projet name.
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Description */}
                        <Form.Group controlId="projectDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Description" />   
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit" >
                            Add
                        </Button>

                    </Modal.Footer>
                </Form>
            </Modal>
            
        </div>
        </div>     
    )}
export default Home