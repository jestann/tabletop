// NOTE from ELECTRON DOCS.
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Initialize Kele Client

// const Kele = require('./Kele')
// const kele = new Kele()
// kele.initalize()



class Kele {
  constructor() {
    this.baseUrl = 'https://www.bloc.io/api/v1'
    this.authToken = null
    this.userObject = null
    this.mentorSchedule = null
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
      return this.authToken
    } 
    catch(error) { console.log(error) }
  }

  async getMe () {
    try {
      let response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'authorization': this.authToken},
      })
      this.userObject = await JSON.parse(response)
      return this.userObject
    }
    catch(error) { console.log(error) }
  }
  
  async getMentorAvailability (mentorId) {
    try {
      let response = await fetch(`${this.baseUrl}/mentors/${mentorId}/student_availability`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'authorization': this.authToken},
        body: `{ "id": ${mentorId} }`
      })
      this.mentorSchedule = await response.map((obj) => JSON.parse(obj))
      return this.mentorSchedule
    }
    catch(error) { console.log(error) }
  }
  
  async getRoadmap (roadmapId) {
    try {
      let response = await fetch(`${this.baseUrl}/roadmaps/${roadmapId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'authorization': this.authToken},
        body: `{ "id": ${roadmapId} }`
      })
      this.roadmap = await response.map((obj) => JSON.parse(obj))
      return this.roadmap
    }
    catch(error) { console.log(error) }
  }
  
  async getCheckpoint (checkpointId) {
    try {
      let response = await fetch(`${this.baseUrl}/checkpoints/${checkpointId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'authorization': this.authToken},
        body: `{ "id": ${checkpointId} }`
      })
      this.checkpoint = await response.map((obj) => JSON.parse(obj))
      return this.checkpoint
    }
    catch(error) { console.log(error) }
  }
}

// module.exports = Kele




class KeleView {
  constructor() {
    // const Kele = require('Kele')
    this.kele = new Kele()
  }
  
  async initializeView () {
    let email = ''
    let password = ''

    const loginBox = document.getElementsByClassName('login')[0]
    const emailBox = document.getElementById('input-email')
    const passwordBox = document.getElementById('input-password')
    const loginSubmit = document.getElementById('login-submit')

    const userBox = document.getElementsByClassName('user')[0]
    const userInfo = document.getElementById('user-info')
    
    const mentorBox = document.getElementsByClassName('mentor')[0]
    const roadmapBox = document.getElementsByClassName('roadmap')[0]
    const checkpointBox = document.getElementsByClassName('checkpoint')[0]
    

    async function loginListener () {
      email = emailBox.value
      password = passwordBox.value
      
      // how to best handle this?
      this.kele.authToken = await this.kele.initialize (email, password)
      console.log(`auth token retrieved: ${this.kele.authToken}`)
      
      this.kele.userObject = await this.kele.getMe(this.kele.authToken)
      console.log(this.kele.userObject)

      if (this.kele.userObject) {
        loginBox.className = 'login hidden'
        
        userBox.className = 'user'
        userInfo.innerHTML = `Welcome to Bloc ${this.kele.userObject.name}!`
        
        mentorBox.className = 'mentor'
        roadmapBox.className = 'roadmap'
        checkpointBox.className = 'checkpoint'
        
      } else {
        userBox.className = 'user error'
        userInfo.innerHTML = 'No user information available. Please try logging in again.'
      }
    }
        
    loginSubmit.addEventListener('click', this.loginListener)
  }
  
  async setupMentorView () {
  
    const mentorBox = document.getElementsByClassName('mentor')[0]
    const mentorSubmit = document.getElementById("mentor-submit")
    
    async function refreshMentorView () {
      const scheduleBox = document.getElementById("schedule-id")
      const wantBox = document.getElementById("want-box-id")
      
      const schedule = await this.kele.getMentorAvailability(this.kele.userObject.mentor_id)
      scheduleBox.innerHTML = ''
      wantBox.innerHTML = ''
      
      schedule.forEach((availObject) => {
        const timeBox = document.createElement('div')
        timeBox.className = 'timebox t-hover tabling'
        const start = document.createElement('p')
        start.innerHTML = `Starts At: ${availObject.starts_at}`
        const end = document.createElement('p')
        end.innerHTML = `Ends At: ${availObject.ends_at}`
        const claim = document.createElement('div')
        claim.className = "timebox timebox-button"
        claim.innerHTML = "Claim this Spot!"
        timeBox.appendChild(start)
        timeBox.appendChild(end)
        timeBox.appendChild(claim)
      
        claim.addEventListener("click", function(event) {
          scheduleBox.childNodes.forEach((timeBox) => { 
            timeBox.childNodes[2].className = 'timebox timebox-button';
            timeBox.childNodes[2].innerHTML = "Claim this Spot!";
          })
          event.target.className = "timebox selected"
          event.target.innerHTML = "This spot claimed."
  
          const savedBox = document.createElement('div')
          savedBox.className = "timebox want-box tabling"
          const claimedIt = document.createElement('div')
          claimedIt.innerHTML = "This Time Reserved:"
          claimedIt.className = "want-box-claim"
          const startTime = document.createElement('p')
          startTime.innerHTML = `Starts At: ${availObject.starts_at}`
          const endTime = document.createElement('p')
          endTime.innerHTML = `Ends At: ${availObject.ends_at}`
          savedBox.appendChild(claimedIt)
          savedBox.appendChild(startTime)
          savedBox.appendChild(endTime)
  
          wantBox.innerHTML = ''
          wantBox.appendChild(savedBox)
        })
  
        scheduleBox.appendChild(timeBox)
      })
    }
    
    await this.refreshMentorView()
    mentorSubmit.addEventListener('click', this.refreshMentorView)
  }
  
  async setupRoadmapView () {
    const roadmapBox = document.getElementsByClassName('roadmap')[0]
    const roadmapInput = document.getElementById("roadmap-input")
    const roadmapSubmit = document.getElementById('roadmap-submit')
    const mapBox = document.getElementById("roadmap-map")
    
    async function refreshRoadmapView () {
      
      roadmapBox.innerHTML = ''
      const map = await this.kele.getRoadmap(roadmapInput.value)

      // parse the json here?
      map.forEach((element) => {
        const elementBox = document.createElement('div')
        elementBox.className = 'timebox tabling'
        
        for property in element {
          const propBox = document.createElement('div')
          propBox.className = 'timebox tabling'
          propBox.innerHTML = `${property}: ${element[property]}`
          elementBox.appendChild(propBox)
        }
        
        mapBox.appendChild(elementBox)
      })
    }
    
    roadmapSubmit.addEventListener('click', this.refreshRoadmapView)
  }
  
  
  async initialize () {
    await this.initializeView()
    await this.setupMentorView()
    await this.setupRoadmapView()
    // this.setupRoadmapView()
  }
}

// module.exports = KeleView




// setup actual view elements

const keleView = new KeleView()
keleView.initalize()
