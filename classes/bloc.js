// This class manages 'GET' and 'POST' interaction with the Bloc API.

class Bloc {
  constructor() {
    this.baseUrl = 'https://www.bloc.io/api/v1'
    this.authToken = null
    this.userObject = null
    this.mentorSchedule = null
    this.roadmap = null
    this.checkpoint = null
    this.messages = null
  }
  
  async initialize (email, password) {
    try {
      let response = await fetch(`${this.baseUrl}/sessions`, {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({email: email, password: password})
      })
      let data = await response.json()
      this.authToken = data.auth_token
      // console.log(this.authToken)
      return this.authToken
    } 
    catch(error) { console.log(error) }
  }

  async getMe () {
    try {
      let response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'authorization': this.authToken}
      })
      this.userObject = await response.json()
      // console.log(this.userObject)
      return this.userObject
    }
    catch(error) { console.log(error) }
  }
  
  async getMentorAvailability (mentorId) {
    try {
      let response = await fetch(`${this.baseUrl}/mentors/${mentorId}/student_availability`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'authorization': this.authToken}
      })
      this.mentorSchedule = await response.json()
      // console.log(this.mentorSchedule)
      return this.mentorSchedule
    }
    catch(error) { console.log(error) }
  }
  
  async getRoadmap (roadmapId) {
    try {
      let response = await fetch(`${this.baseUrl}/roadmaps/${roadmapId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'authorization': this.authToken}
      })
      this.roadmap = await response.json()
      // console.log(this.roadmap)
      return this.roadmap
    }
    catch(error) { console.log(error) }
  }
  
  async getCheckpoint (checkpointId) {
    try {
      let response = await fetch(`${this.baseUrl}/checkpoints/${checkpointId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'authorization': this.authToken}
      })
      this.checkpoint = await response.json()
      // console.log(this.checkpoint)
      return this.checkpoint
    }
    catch(error) { console.log(error) }
  }

  // I get an error when I run this method: 
  // TypeError: Failed to execute 'fetch' on 'Window': Request with GET/HEAD method cannot have body.
  async getMessages (page=null) {
    try {
      // OPTIONAL page parameter or return all threads
      let response = null
      if (page) {
        response = await fetch(`${this.baseUrl}/message_threads`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json', 'authorization': this.authToken},
          body: `{"page": ${page}}`
        })
      } else {
        response = await fetch(`${this.baseUrl}/message_thrads`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json', 'authorization': this.authToken}
        })
      }
      console.log(response)
      this.messages = await response.json()
      console.log(this.messages)
      return this.messages
    }
    catch(error) { console.log(error) }
  }

  async createMessage (threadToken=null, recipientId, subject="", body) {
    try {
      // OPTIONAL threadToken or create new thread with subject
      let response = null
      if (threadToken) { 
        response = await fetch(`${this.baseUrl}/messages`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'authorization': this.authToken},
          body: `{ 
            "sender": "${this.userObject.email}",
            "recipient_id": ${recipientId},
            "token": "${threadToken}",
            "stripped-text": "${body}"
          }`
        })
      } else {
        response = await fetch(`${this.baseUrl}/messages`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'authorization': this.authToken},
          body: `{ 
            "sender": "${this.userObject.email}",
            "recipient_id": ${recipientId},
            "subject": "${subject}",
            "stripped-text": "${body}"
          }`
        })
      }
      console.log(response)
      return await response
    }
    catch(error) { console.log(error) }
  }

  async submitCheckpoint (checkpointId, assignmentBranch=null, assignmentLink=null, comment) {
    try {
      let response = null
      // OPTIONAL assignment branch and link
      if (assignmentBranch && assignmentLink) {
        let response = await fetch(`${this.baseUrl}/checkpoint_submissions`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'authorization': this.authToken},
          body: `{ 
            "assignment_branch": "${assignmentBranch}",
            "assignment_commit_link": ${assignmentLink},
            "checkpoint_id": "${checkpointId}",
            "comment": "${comment}",
            "enrollment_id": "${this.userObject.enrollment_id}"
          }`
        })
      } else {
        let response = await fetch(`${this.baseUrl}/checkpoint_submissions`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'authorization': this.authToken},
          body: `{ 
            "checkpoint_id": "${checkpointId}",
            "comment": "${comment}",
            "enrollment_id": "${this.userObject.enrollment_id}"
          }`
        })
      }
      console.log(response)
      let data = await response.json()
      console.log(data)
      return { success: true, time: data.updated_at }
    }
    catch(error) { console.log(error) }
  }
}

module.exports = Bloc