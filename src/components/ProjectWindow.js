import { Table, Form, Button, Tab, Tabs,  Modal ,Dropdown,Toast} from 'react-bootstrap'
import React, { useState} from 'react';
import { useHistory} from "react-router-dom";


const sc=require("../services/serverCom.js");


const ProjectWindow = ({userName, projectJson}) => {
    var adminFound = false
    var showToast = false
    var showoverdueToast = false
  
    let currentDate = Date.parse(new Date().toISOString().split('T')[0])
    var issuesJSON =[]
    if(projectJson.issues.length !== 0)
    {
        for (var index in projectJson.issues)
        {
            var selectedDate = Date.parse(projectJson.issues[index].date)

            if(selectedDate < currentDate && projectJson.issues[index].status === "active")
                 showoverdueToast=true

  
            if((projectJson.issues[index].status === "waiting") && (projectJson.issues[index].assignedBy===userName))
                    showToast = true
            issuesJSON.push(projectJson.issues[index])
        }
    }
    
    
    //component members
    const [m_issuesList, setIssuesList] = useState(issuesJSON);
    const [m_adminList, setAdminList] = useState(projectJson.admin);
    const [m_memberList, setMemberList] = useState(projectJson.members);
    const [m_currentIssueID, setCurrentIssueID] = useState(projectJson.issues.length)

    const [m_showPendingToast, setShowPendingToast] = useState(showToast)
    const [m_showOverdueToast, setShowOverdueToast] = useState(showoverdueToast)
    


    


    //component global params
    const [formValidated, setFormValidated] = useState(false);
    const [showAddIssue, setAddIssue] = useState(false);
    const [showAddMember, setAddMember] = useState(false);
    const [newMemberPremission, setPremmisoin] = useState("Member");
    const [issueDateValid, setIssueDateValid] = useState(false);
    const [issueDateInValid, setIssueDateInValid] = useState(false);

    
    
    //init
    for (var index in projectJson.admin)
    {
        if(projectJson.admin[index] === userName)
        {
            adminFound = true
            break;
        }
    }

    let itemsList = []
    for (var index in projectJson.admin)
    {
        itemsList.push(projectJson.admin[index])
    }

    for (var index in projectJson.members)
    {
        itemsList.push(projectJson.members[index])
    }
    

    
    const [isAdmin, setIsAdmin] = useState(adminFound);

    const [dropDownItems, setDropDownItems] = useState(itemsList)

 
    
    //functions


    //Done, Confirm, Decline function
    const onIssueStatusChangeFail = (message) => {
        alert(message)
    }

    const onIssueStatusChangeSuccess = (issueJSON) => {
         //update status of current GUI list
         for (var index in m_issuesList)
         {
             if(m_issuesList[index].id === issueJSON.issueID)
             {
                 m_issuesList[index].status = issueJSON.finalStatus
                 var issue = m_issuesList[index]
                 m_issuesList.splice(index, 1);
                 let newList = [... m_issuesList, issue]
                 setIssuesList(newList)
                 break
             }
         }
    }

    const changeIssueStatus = (issueID, newStatus, assignedBy) =>{
        var finalStatus
        if(newStatus === "waiting" && userName === assignedBy)
        {
             finalStatus = "completed"  
        }
        else
        {
            finalStatus = newStatus
        }

        sc.updateIssueStatus(projectJson._id, issueID, finalStatus , onIssueStatusChangeSuccess, onIssueStatusChangeFail)

       
    }




    //Add member functions
    const successAddMemberToDB = (userName, premission, message) => {
        
        if(premission === "Admin")
        {
            const newList = [...m_adminList, userName];
            setAdminList(newList);
        }
        else
        {
            const newList = [...m_memberList, userName];
            setMemberList(newList);
        }   
        const newList = [... dropDownItems, userName]
        setDropDownItems(newList)
        alert(message)
    }
    
    const failAddMemberToDB = (message) =>{
        alert(message)
    }
    const closeMemberForm = () =>
    {
        setFormValidated(false);
        setPremmisoin("Member")
        setAddMember(false)
    }
    const submitMember = (event) =>{
        event.preventDefault();
        const form = event.currentTarget
        const memberUserName = form.memberUserName.value


        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setFormValidated(true);
        }
   
        else
        {      
            closeMemberForm()
            sc.addMember(memberUserName,projectJson.projectName, newMemberPremission, projectJson._id, successAddMemberToDB, failAddMemberToDB)
           

        }
        

    }
    //Add issue functions
    const successAddIssue = (issueJSON) => {
        setCurrentIssueID(m_currentIssueID + 1)
        let newList = [... m_issuesList, issueJSON]
        setIssuesList(newList)
    }
    
    const failedAddIssue = (message) =>{
        alert(message)
    }

    const closeIssueForm = () => 
    {
        setFormValidated(false);
        setIssueDateValid(false)
        setIssueDateInValid(false)
        setAddIssue(false)
    }

    const submitIssue = (event) =>{
        event.preventDefault();
        const form = event.currentTarget
        const issueDesc = form.IssueDesc.value
        const selectedMember = form.selectedMember.value
        const date = form.date.value
        
        
        var isValidFlg = true

        if (form.checkValidity() === false ) {
            event.preventDefault();
            event.stopPropagation();
            setFormValidated(true);
            isValidFlg = false

        }
                    

        if(isValidFlg)
        {     
            closeIssueForm()
            sc.addIssue(projectJson._id,m_currentIssueID,issueDesc, date, userName, selectedMember,"active" , successAddIssue, failedAddIssue)
        }

    }





    //classes for tabs view
    const Issues = (issues) => {
        const IssuesRow = ({id, desc, dueData, assignedBy,assignedTo, status}) => {
            let button = null
            if((status==="active"))
            {
                if (((assignedBy===userName) && (assignedTo!==userName)))
                {
                   button =  <Button variant="secondary" disabled>On Work</Button>
                }
                else 
                {
                    button =  <Button variant="outline-primary" onClick = {() => {changeIssueStatus(id,"waiting",assignedBy)}}>Submit</Button>
                }
            } 
            else if(status === "waiting")
            {
                button =  <Button variant="secondary" disabled>Waiting</Button>
            }


            return (    
                    <tr key={id}>
                        <td>{id}</td>
                        <td>{desc}</td>
                        <td>{dueData}</td>
                        <td>{assignedBy}</td>
                        <td>{assignedTo}</td>
                        <td>
                            {button}
                        </td>
                    </tr>
            )}
        return (    
            <div >
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Assigned By</th>
                        <th>Assigned To</th>
                        <th>        </th>
                        </tr>
                    </thead>
                    <tbody>
                    {m_issuesList.map(({ id,desc, date, assignedBy,assignedTo, status}) => (
                        ((Date.parse(date) >= currentDate) && (status==="active" || status ==="waiting") && ((assignedBy===userName) || (assignedTo===userName)) )?
                            <IssuesRow  key = {"issue" + id} id = {id} desc = {desc} dueData = {date} assignedBy={assignedBy} assignedTo = {assignedTo} status={status}></IssuesRow>
                        :
                            null
                    ))}
                    
                    </tbody>
                    </Table>
            </div>
            
            
    
        )}
       

    const Completed = () => {
        const CompletedRow = ({id, desc, dueData, assignedBy,assignedTo, status}) => {
            return (    
                    <tr key={id}>
                        <td>{id}</td>
                        <td>{desc}</td>
                        <td>{dueData}</td>
                        <td>{assignedBy}</td>
                        <td>{assignedTo}</td>
                    </tr>
            )}
        return (    
            <div >
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Assigned By</th>
                        <th>Assigned To</th>
                        </tr>
                    </thead>
                    <tbody>
                    {m_issuesList.map(({ id,desc, date, assignedBy,assignedTo, status}) => (
                        (((assignedBy===userName) || (assignedTo===userName)) && (status==="completed" )) ?<CompletedRow  key = {"comp" + id} id = {id} desc = {desc} dueData = {date} assignedBy={assignedBy} assignedTo = {assignedTo} status={status}></CompletedRow>: null
                    ))}
                    
                    </tbody>
                    </Table>
            </div>
            
            
    
        )}
    const Overdue = () => {
        const OverdueRow = ({id, desc, dueData, assignedBy,assignedTo, status}) => {
            let button = null

            if ((assignedBy===userName) && (assignedTo!==userName))
            {
                button =  <Button variant="outline-danger" disabled>Late!</Button>
            }
            else if(status==="active")
            {
                button =  <Button variant="outline-primary" onClick = {() => {changeIssueStatus(id,"waiting",assignedBy)}}>Submit</Button>
            }else if(status==="waiting")
            {
                button =  <Button variant="outline-secondary" disabled>Waiting</Button>
            }

            return (    
                    <tr key={id}>
                        <td>{id}</td>
                        <td>{desc}</td>
                        <td>{dueData}</td>
                        <td>{assignedBy}</td>
                        <td>{assignedTo}</td>
                        <td>{button}</td>
                        
                    </tr>
            )}
        return (    
            <div >
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Assigned By</th>
                        <th>Assigned To</th>
                        <th>        </th>
                        </tr>
                    </thead>
                    <tbody>
                    {m_issuesList.map(({ id,desc, date, assignedBy,assignedTo, status}) => (
                        ((Date.parse(date)  < currentDate) && ((assignedBy===userName) || (assignedTo===userName)) && (status === "waiting" || status === "active")) ?
                            <OverdueRow key = {"overdue" + id} id = {id} desc = {desc} dueData = {date} assignedBy={assignedBy} assignedTo = {assignedTo} status={status}></OverdueRow>
                        : 
                            null
                    ))}
                    
                    </tbody>
                    </Table>
            </div>
            
            
    
        )}

    const Members = () => {
        const MembersRow = ({name, premission}) => {
            let button
            if (premission === "Admin"  ) {
                button =  <Button variant="primary" disabled>Admin</Button>
            } else {
                button =  <Button variant="secondary" disabled>Member</Button>
            }

            return (    
                    <tr>
                        <td>{name}</td>
                        <td>
                            {button}
                        </td>
                    </tr>
            )}
        return (    
            <div >
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>User Name</th>
                        <th>Premission</th>
                        </tr>
                    </thead>
                    <tbody>
                    {m_adminList.map((name) => (
                        <MembersRow  key = {"mem" + name} name = {name} premission = "Admin"></MembersRow>
                    ))}
                    {m_memberList.map((name) => (
                        <MembersRow  key = {"mem" + name} name = {name} premission = "Member"></MembersRow>
                    ))}
                    
                    </tbody>
                    </Table>
            </div>
    )}

    const Waiting = () => {
        const WaitingRow = ({id, desc, dueData, assignedBy,assignedTo, status}) => {
            return (    
                    <tr key={id}>
                        <td>{id}</td>
                        <td>{desc}</td>
                        <td>{dueData}</td>
                        <td>{assignedBy}</td>
                        <td>
                            <Button variant="primary" onClick = {() => {changeIssueStatus(id,"completed",assignedBy)}}>Confirm</Button>
                            <Button variant="danger" onClick = {() => {changeIssueStatus(id,"active",assignedBy)}}>Decline</Button>
                        </td>

                        
                    </tr>
            )}
        return (    
            <div >
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Assigned By</th>
                        <th>        </th>
                        </tr>
                    </thead>
                    <tbody>
                    {m_issuesList.map(({ id,desc, date, assignedBy,assignedTo, status}) => (
                        (((assignedBy===userName)) && (status==="waiting" )) ?<WaitingRow  key = {"wait" + id} id = {id} desc = {desc} dueData = {date} assignedBy={assignedBy} assignedTo = {assignedTo} status={status}></WaitingRow>: null
                    ))}
                
                    </tbody>
                    </Table>


            </div>
            
            
            
            
    
        )}

    //render ProjectWindow
    return (  

        <div className='center'>
        <div>
        <div  className="labelStyle">Projcet: {projectJson.projectName} </div>
        </div>
        <div>
            <div>
                <Toast show={m_showPendingToast} onClose={() => setShowPendingToast(false)}  delay={10000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">Pending Requests</strong>
                        </Toast.Header>
                        <Toast.Body>You have issues which are waiting for confirmation.</Toast.Body>
                </Toast>
                <Toast show={m_showOverdueToast} onClose={() => setShowOverdueToast(false)}  delay={10000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">OverDue Issues</strong>
                        </Toast.Header>
                        <Toast.Body>You have overdue issues. </Toast.Body>
                </Toast>
            </div>
            <div> 
                <br></br>
            </div>

            
            <Button key = "btn-issue" variant="outline-success" onClick={() => setAddIssue(true)} >Add Issue</Button>
            { isAdmin ?  <Button key = "btn-member" variant="outline-primary" onClick={() => setAddMember(true)} >Add Member</Button>: null }
   
            <hr></hr>  
        </div>
            <Tabs defaultActiveKey="issues" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="issues" tabClassName="profile-issueTab" title="Issues" >
                <Issues />   
            </Tab>
            <Tab eventKey="completed" tabClassName="profile-completeTab" title="Completed">
                <Completed />      
            </Tab>
            <Tab eventKey="overdue" tabClassName="profile-overdueTab" title="Overdue">
                <Overdue />  
            </Tab>
            <Tab eventKey="members" tabClassName="profile-membersTab" title="Members">
                <Members />  
            </Tab>
            { isAdmin ? <Tab eventKey="waiting" tabClassName="profile-waitingTab"  title="Pending">
                <Waiting />  
            </Tab> : null }
            

            </Tabs>
             {/* Adding Issue Form*/}
             <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={showAddIssue} onHide={closeIssueForm}>
                <Form noValidate validated={formValidated} onSubmit={submitIssue}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        {/* Issue */}
                        <Form.Group controlId="IssueDesc">
                            <Form.Label>Issue Description</Form.Label>
                            <Form.Control required as="textarea" rows={3} placeholder="Write something..."/>   
                            <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                            Please enter an issue description.
                            </Form.Control.Feedback>
                        </Form.Group>

                    
                        <Form.Group className="mb-3" controlId="selectedMember">
                        <Form.Label>Assign To:</Form.Label>
                        <Form.Control as="select">
                        {
                            isAdmin? 
                            dropDownItems.map((name) => (
                                <option value={name} >{name} </option>
                            ))
                            :   
                            <option value={userName} >{userName} </option>
                            
                        }
                        </Form.Control>

                    </Form.Group>
                    <Form.Group controlId="date">
                        <Form.Label> Due Date:</Form.Label>
                        <Form.Control type="date"  defaultValue= {new Date().toISOString().split('T')[0]}
                        isValid = {issueDateValid}
                        isInvalid = {issueDateInValid}/>
                        <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                        Selected date is not valid.
                        </Form.Control.Feedback>
                    </Form.Group>
              
                       

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeIssueForm}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit" >
                            Add
                        </Button>

                    </Modal.Footer>
                </Form>
            </Modal>


            {/* Adding Member Form*/}
            <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={showAddMember} onHide={closeMemberForm}>
                <Form noValidate validated={formValidated} onSubmit={submitMember}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Member</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        
                        <Form.Group controlId="memberUserName">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control required type="text" placeholder={"Insert Name"} />
                            <Form.Control.Feedback type="valid"></Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                            Please enter a user name.
                            </Form.Control.Feedback>

                            <Form.Label>Choose Premissions</Form.Label>
                        </Form.Group>
                        <Dropdown>

                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                        {newMemberPremission}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1" onClick = {() => setPremmisoin("Member")}>Member</Dropdown.Item>
                            <Dropdown.Item href="#/action-2" onClick = {() => setPremmisoin("Admin")}>Admin</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeMemberForm}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit" >
                            Add
                        </Button>

                    </Modal.Footer>
                </Form>
            </Modal>
            
      
         
  
            
        </div>

    )
}



export default ProjectWindow