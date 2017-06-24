// This version uses an internally defined Kele class.
// It has full view functionality.
// All the view works, but it has some API interaction errors.
// Some of them seem to have to do with permissions in the Bloc API...?



// CLASS to manage interaction with the Bloc API.

class Kele {
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


// VIEW FUNCTIONALITY built on defined Kele class

const kele = new Kele()

async function initializeView () {
  let email = ''
  let password = ''

  const loginBox = document.getElementsByClassName('login')[0]
  const emailBox = document.getElementById('input-email')
  const passwordBox = document.getElementById('input-password')
  const loginSubmit = document.getElementById('login-submit')

  const userBox = document.getElementById('user')
  const mentorBox = document.getElementById('mentor')
  const roadmapBox = document.getElementById('roadmap')
  const checkpointBox = document.getElementById('checkpoint')
  const messagesBox = document.getElementById('messages')

  async function loginListener () {
    email = emailBox.value
    password = passwordBox.value
    
    await kele.initialize (email, password)
    // console.log(`auth token retrieved: ${kele.authToken}`)
    
    await kele.getMe()
    // console.log(kele.userObject)

    if (kele.userObject) {
      loginBox.className = 'login hidden'
      
      userBox.className = 'user'
      userBox.innerHTML = `<h2>Welcome to Bloc, ${kele.userObject.name}!</h2>`
      
      mentorBox.className = 'mentor'
      roadmapBox.className = 'roadmap'
      checkpointBox.className = 'checkpoint'
      messagesBox.className = 'messages'
      
    } else {
      userBox.className = 'error'
      userBox.innerHTML = 'No user information available. Please try logging in again.'
    }
  }
      
  loginSubmit.addEventListener('click', loginListener)
  passwordBox.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        loginListener()
      }
  })
}


async function setupMentorView () {

  const mentorBox = document.getElementById('mentor')
  const mentorSubmit = document.getElementById("mentor-submit")
  
  async function refreshMentorView () {
    const scheduleBox = document.getElementById("schedule")
    const wantBox = document.getElementById("want-box")
    
    scheduleBox.innerHTML = ''
    wantBox.innerHTML = ''

    const schedule = await kele.getMentorAvailability(kele.userObject.current_enrollment.mentor_id)
    let timeIndex = 0
    
    if (schedule) {
      schedule.forEach((availObject) => {
        timeIndex++

        const date = availObject.starts_at.slice(5,10)
        const start = availObject.starts_at.slice(11,16)
        const end = availObject.ends_at.slice(11,16)

        const timeBox = document.createElement('div')
        timeBox.className = 'timebox t-hover tabling'

        const dateBox = document.createElement('p')
        dateBox.innerHTML = `Date: ${date}`
        const startBox = document.createElement('p')
        startBox.innerHTML = `From: ${start}`
        const endBox = document.createElement('p')
        endBox.innerHTML = `To: ${end}`
        const claim = document.createElement('div')
        claim.className = "timebox timebox-button"
        claim.innerHTML = "Claim this Spot!"
        
        timeBox.appendChild(dateBox)
        timeBox.appendChild(startBox)
        timeBox.appendChild(endBox)
        timeBox.appendChild(claim)
      
        function claimListener (event) {
          if (scheduleBox.childNodes) {
            scheduleBox.childNodes.forEach((timeBox) => {
              if (timeBox.childNodes[3]) { 
                timeBox.childNodes[3].className = 'timebox timebox-button';
                timeBox.childNodes[3].innerHTML = "Claim this Spot!";
              }
            })
          }
          event.target.className = "timebox selected"
          event.target.innerHTML = "This spot claimed."
  
          const claimedIt = document.createElement('h4')
          claimedIt.innerHTML = "Time Reserved."
          const theDate = document.createElement('p')
          theDate.innerHTML = `Date: ${date}`
          const startTime = document.createElement('p')
          startTime.innerHTML = `From: ${start}`
          const endTime = document.createElement('p')
          endTime.innerHTML = `To: ${end}`
          wantBox.appendChild(claimedIt)
          wantBox.appendChild(theDate)
          wantBox.appendChild(startTime)
          wantBox.appendChild(endTime)

          wantBox.className = 'timebox'    
          wantBox.innerHTML = ''
          wantBox.appendChild(claimedIt)
          wantBox.appendChild(theDate)
          wantBox.appendChild(startTime)
          wantBox.appendChild(endTime)
        }
        claim.addEventListener("click", claimListener)
        
        if (timeIndex % 3 === 0){
          const magicDiv = document.createElement('div')
          magicDiv.innerHTML = ' '
          scheduleBox.appendChild(magicDiv)
        }
        scheduleBox.appendChild(timeBox)
      })
    }
  }
  mentorSubmit.addEventListener('click', refreshMentorView)
}


async function setupRoadmapView () {
  const roadmapBox = document.getElementById('roadmap')
  const roadmapInput = document.getElementById("roadmap-input")
  const roadmapSubmit = document.getElementById('roadmap-submit')
  const mapBox = document.getElementById("roadmap-map")
  
  async function refreshRoadmapView () {
    mapBox.innerHTML = ''
    const map = await kele.getRoadmap(roadmapInput.value)

    if (map) {
      const mapName = document.createElement('h3')
      mapName.innerHTML = `Roadmap: ${map.name}`

      const sectionsBox = document.createElement('div')
      map.sections.forEach( (sectionObject) => {
        const sectionName = document.createElement('h4')
        sectionName.innerHTML = sectionObject.name

        const checkpointsList = document.createElement('ul')
        sectionObject.checkpoints.forEach( (checkpoint) => {
          const checkpointItem = document.createElement('li')
          checkpointItem.innerHTML = `${checkpoint.id}  |  ${checkpoint.name}`
          checkpointsList.appendChild(checkpointItem)  
        })

        sectionsBox.appendChild(sectionName)
        sectionsBox.appendChild(checkpointsList)
      })

      mapBox.appendChild(mapName)
      mapBox.appendChild(sectionsBox)
    }
  }
  
  roadmapSubmit.addEventListener('click', refreshRoadmapView)
  roadmapInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        refreshRoadmapView()
      }
  })
}


async function setupCheckpointView () {
  const checkpointIdInput = document.getElementById("checkpoint-id-input")
  const checkpointGet = document.getElementById('checkpoint-get')
  const pointBox = document.getElementById("checkpoint-map")
  const submissionBox = document.getElementById('checkpoint-submission')
  
  async function refreshCheckpointView () {
    pointBox.innerHTML = ''

    const point = await kele.getCheckpoint(checkpointIdInput.value)
    // ERROR: "Sorry, you are not authorized to do that."
    if (point.name) {
      const pointName = document.createElement('h3')
      pointName.innerHTML = `${point.name}`
      pointBox.appendChild(pointName)
    } else {
      pointBox.innerHTML = "Error retrieving checkpoint information."
    }

    submissionBox.className = 'submission'
  }

  checkpointGet.addEventListener('click', refreshCheckpointView)
  checkpointIdInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        refreshCheckpointView()
      }
  })

  const assignmentBranchInput = document.getElementById('assignment-branch')
  const assignmentLinkInput = document.getElementById('assignment-link')
  const commentInput = document.getElementById('checkpoint-comment')
  const checkpointSubmit = document.getElementById('checkpoint-submit')
  const checkpointSuccess = document.getElementById('checkpoint-success')

  async function sendCheckpoint () {
    let submission = await kele.submitCheckpoint(
      checkpointIdInput.value,
      assignmentBranchInput.value,
      assignmentLinkInput.value,
      commentInput.value
    )

    if (submission.success) {
      checkpointIdInput = ''
      pointBox.innerHTML = ''

      commentInput.value = ''
      assignmentBranchInput.value = ''
      assignmentLinkInput.value = ''

      checkpointSuccess.innerHTML = `Checkpoint successfully submitted at ${submission.date}.`
    } else {
      checkpointSuccess.innerHTML = 'Error submitting checkpoint. Please try again.'
    }
  }

  checkpointSubmit.addEventListener('click', sendCheckpoint)
  commentInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      sendCheckpoint()
    }
  })
}


async function setupMessagesView () {
  const messagesGet = document.getElementById('messages-get')
  const threadsPage = document.getElementById('messages-page')
  const threadsView = document.getElementById('message-threads-view')

  async function refreshMessages () {
    threadsView.className = ''
    threadsView.innerHTML = ''

    const messagesObject = await kele.getMessages(threadsPage.value)

    if (messagesObject) {
      const countBox = document.createElement('p')
      countBox.innerHTML = `Number of Threads: ${messagesObject.count}`

      const threadsList = document.createElement('ul')
      messagesObject.items.forEach( (threadObject) => {
        const threadBox = document.createElement('li')

        const threadId = document.createElement('p')
        threadId.innerHTML = `Thread Id: ${threadObject.id}`
        const threadSubject = document.createElement('p')
        threadSubject.innerHTML = `Subject: ${threadObject.subject}`
        const threadCount = document.createElement('p')
        threadCount.innerHTML = `${threadObject.messages_count} messages in thread.`
        const threadDate = document.createElement('p')
        threadDate.innerHTML = `Last Message at ${threadObject.updated_at} by ${threadObject.first_name} ${threadOject.last_name}`
        const threadPreview = document.createElement('p')
        threadPreview.innerHTML = `${threadObject.preview}`

        threadBox.appendChild(threadId)
        threadBox.appendChild(threadSubject)
        threadBox.appendChild(threadCount)
        threadBox.appendChild(threadDate)
        threadBox.appendChlid(threadPreview)

        threadsList.appendChild(threadBox)
      })

      threadsView.appendChild(countBox)
      threadsView.appendChild(threadsList)
    } else {
      threadsView.innerHTML = "Error retrieving messages."
    }
  }

  messagesGet.addEventListener('click', refreshMessages)
  threadsPage.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        refreshMessages()
      }
  })

  const messageSubmissionBox = document.getElementById('message-submission')
  const threadInput = document.getElementById('message-thread')
  const recipientInput = document.getElementById('message-recipient')
  const subjectInput = document.getElementById('message-subject')
  const bodyInput = document.getElementById('message-body')
  const messageSubmit = document.getElementById('message-submit')
  const messageSuccess = document.getElementById('message-success')

  async function sendMessage () {
    let message = await kele.createMessage(
      threadInput.value,
      recipientInput.value,
      subjectInput.value,
      bodyInput.value
    )

    if (message.success) {
      threadInput.value = ''
      recipientInput.value = ''
      subjectInput.value = ''
      bodyInput.value = ''

      messageSuccess.innerHTML = `Message successfully sent.`
    } else {
      messageSuccess.innerHTML = 'Error sending message. Please try again.'
    }
  }

  messageSubmit.addEventListener('click', sendMessage)
  bodyInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      sendMessage()
    }
  })
}


async function initialize () {
  await initializeView()
  await setupMentorView()
  await setupRoadmapView()
  await setupCheckpointView()
  await setupMessagesView()
}

initialize()
