import axios from 'axios'

import {SetUser} from '../components/Navigator'; 

const baseUrl = 'https://polar-everglades-75875.herokuapp.com'
export let data={username:"",password:"",lists:"[]"}
export function signIn(username,password,onSuccess,onFailure) {
    data={username:"",password:"",lists:"[]"}
    const request = axios.get(`${baseUrl}/api/login/:${username}/:${password}`,  { crossdomain: true })
        return request.then((response) => {
        console.log(response.data)
        if (response.data==null)
        {
            onFailure()
            SetUser({name:"guest",isLog:false})
        }
        else
        {
          console.log("after getting user projects:")
          console.log(response.data)
          // console.log(response.data.userName)
          // console.log(response.data.userProjectsJSON)
          


          onSuccess(response.data.userName, response.data.userProjectsJSON)

          SetUser({name:username,isLog:true})
          
           
        }
        
        

    }).catch(error => console.log(error))
  }


  export function register(username,password,onSuccess,onFailure) {
    const request = axios.post(`${baseUrl}/api/register/:${username}/:${password}`,  { crossdomain: true })
    return request.then((response) => {
        console.log(response.data)
        if (response.data==null)
        {
            onFailure()
        }
        else
        {
            SetUser({name:username,isLog:true})
            onSuccess(username)
        }
    }).catch(error => console.log(error))
  
    }


    export function addProject(userName,projectName,projectDesc,projectsList,onSuccess,onFailure) {
      console.log("serverCom addProjectToDB") 
      //const request = axios.post(`${baseUrl}/api/register/:${username}/:${password}`,  { crossdomain: true })
      const request = axios.post(`${baseUrl}/api/addProject/:${userName}/:${projectName}/:${projectDesc}/:${projectsList}`,  { crossdomain: true })
      return request.then((response) => {
          console.log(response.data)
          if (response.data==null)
          {
            onFailure()
          }
          else
          {
            console.log(response.data)
            onSuccess(response.data)
          }
      }).catch(error => console.log(error))
    
      }

      export function addMember(userName,projectName,premission,id,onSuccess,onFailure) {
        console.log("serverCom addMemberToDB") 
        //const request = axios.post(`${baseUrl}/api/register/:${username}/:${password}`,  { crossdomain: true })
        const request = axios.post(`${baseUrl}/api/addMember/:${userName}/:${projectName}/:${premission}/:${id}`,  { crossdomain: true })
        return request.then((response) => {
            console.log("sc addMember")
            console.log(response.data)
            if (response.data==null)
            {
              onFailure("There was an error while adding member")
            }
            else
            {
              if(response.data.passed === false)
              {
                onFailure(response.data.msg)
              }
              else
              {
                onSuccess(userName, premission, response.data.msg)
              }
             
            }
        }).catch(error => console.log(error))
      
        }

        export function addIssue(projectID,issueID,desc,dueDate,assignedBy,assignedTo,status,onSuccess,onFailure) {
          console.log("serverCom addIssue") 
          //const request = axios.post(`${baseUrl}/api/register/:${username}/:${password}`,  { crossdomain: true })
          const request = axios.post(`${baseUrl}/api/addIssue/:${projectID}/:${issueID}/:${desc}/:${dueDate}/:${assignedBy}/:${assignedTo}/:${status}`,  { crossdomain: true })
          return request.then((response) => {
              console.log("sc addIssue")
              console.log(response.data)
              if (response.data==null)
              {
                onFailure("There was an error while adding member")
              }
              else
              {
                if(response.data.passed === false)
                {
                  onFailure(response.data.msg)
                }
                else
                {
                  onSuccess(response.data)
                }
               
              }
          }).catch(error => console.log(error))
        
          }

          export function updateIssueStatus(projectID, issueID, finalStatus, onSuccess, onFailure) {
            console.log("serverCom updateIssue") 
            //const request = axios.post(`${baseUrl}/api/register/:${username}/:${password}`,  { crossdomain: true })
            const request = axios.post(`${baseUrl}/api/updateIssueStatus/:${projectID}/:${issueID}/:${finalStatus}`,  { crossdomain: true })
            return request.then((response) => {
                console.log("sc addIssue")
                console.log(response.data)
                if (response.data==null)
                {
                  onFailure("There was an error while updating issue status")
                }
                else
                {
                  if(response.data.passed === false)
                  {
                    onFailure(response.data.msg)
                  }
                  else
                  {
                    onSuccess(response.data)
                  }
                 
                }
            }).catch(error => console.log(error))
          
            }


      


  


    export function update(user,onSuccess,onFailure) {
        console.log("update")
        const request = axios.put(`${baseUrl}/api/update/user`,JSON.stringify(user),
        {headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
      })
        return request.then((response) => {
            console.log(response.data)
            if (response.data==null)
            {
                onFailure()
            }
            else
            {
                onSuccess()
            }
        }).catch(error => console.log(error))
      }


    



      
  



