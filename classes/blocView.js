// This class manages view functionality for the Bloc API calls.

class BlocView {
  constructor() {
    const Bloc = require('./bloc.js')
    this.bloc = new Bloc()
  }

  async initializeView () {
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
      
      await this.bloc.initialize (email, password)
      // console.log(`auth token retrieved: ${this.kele.authToken}`)
      
      await this.bloc.getMe()
      // console.log(this.kele.userObject)

      if (this.bloc.userObject) {
        loginBox.className = 'login hidden'
        
        userBox.className = 'user'
        userBox.innerHTML = `<h2>Welcome to Bloc, ${this.bloc.userObject.name}!</h2>`
        
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

  async setupMentorView () {
  
    const mentorBox = document.getElementById('mentor')
    const mentorSubmit = document.getElementById("mentor-submit")
    
    async function refreshMentorView () {
      const scheduleBox = document.getElementById("schedule")
      const wantBox = document.getElementById("want-box")
      
      scheduleBox.innerHTML = ''
      wantBox.innerHTML = ''

      const schedule = await this.bloc.getMentorAvailability(this.bloc.userObject.current_enrollment.mentor_id)
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

  async setupRoadmapView () {
    const roadmapBox = document.getElementById('roadmap')
    const roadmapInput = document.getElementById("roadmap-input")
    const roadmapSubmit = document.getElementById('roadmap-submit')
    const mapBox = document.getElementById("roadmap-map")
    
    async function refreshRoadmapView () {
      mapBox.innerHTML = ''
      const map = await this.bloc.getRoadmap(roadmapInput.value)

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
  
  async setupCheckpointView () {
    const checkpointIdInput = document.getElementById("checkpoint-id-input")
    const checkpointGet = document.getElementById('checkpoint-get')
    const pointBox = document.getElementById("checkpoint-map")
    const submissionBox = document.getElementById('checkpoint-submission')
    
    async function refreshCheckpointView () {
      pointBox.innerHTML = ''

      const point = await this.bloc.getCheckpoint(checkpointIdInput.value)
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
      let submission = await this.bloc.submitCheckpoint(
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

  async setupMessagesView () {
    const messagesGet = document.getElementById('messages-get')
    const threadsPage = document.getElementById('messages-page')
    const threadsView = document.getElementById('message-threads-view')

    async function refreshMessages () {
      threadsView.className = ''
      threadsView.innerHTML = ''

      const messagesObject = await this.bloc.getMessages(threadsPage.value)

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
      let message = await this.bloc.createMessage(
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

  async initialize () {
    await this.initializeView()
    await this.setupMentorView()
    await this.setupRoadmapView()
    await this.setupCheckpointView()
    await this.setupMessagesView()
  }
}

module.exports = BlocView