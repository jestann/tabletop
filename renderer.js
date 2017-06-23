// NOTE from ELECTRON DOCS.
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


// This is my working version of renderer.js

// CLASS for API interaction

class Kele {
  constructor() {
    this.baseUrl = 'https://www.bloc.io/api/v1'
    this.authToken = null
    this.userObject = null
    this.mentorSchedule = null
    this.roadmap = null
    this.checkpoint = null
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
      console.log(response)
      this.userObject = await response.json()
      console.log(this.userObject)
      return this.userObject
    }
    catch(error) { console.log(error) }
  }
  
  async getMentorAvailability (mentorId) {
    try {
      let response = await fetch(`${this.baseUrl}/mentors/${mentorId}/student_availability`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'authorization': this.authToken},
      })
      this.mentorSchedule = await response.json()
      console.log(this.mentorSchedule)
      return this.mentorSchedule
    }
    catch(error) { console.log(error) }
  }
  
  async getRoadmap (roadmapId) {
    try {
      let response = await fetch(`${this.baseUrl}/roadmaps/${roadmapId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'authorization': this.authToken},
      })
      this.roadmap = await response.json()
      console.log(this.roadmap)
      return this.roadmap
    }
    catch(error) { console.log(error) }
  }
  
  async getCheckpoint (checkpointId) {
    try {
      let response = await fetch(`${this.baseUrl}/checkpoints/${checkpointId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'authorization': this.authToken},
      })
      this.checkpoint = await response.json()
      console.log(this.checkpoint)
      return this.checkpoint
    }
    catch(error) { console.log(error) }
  }
}



// CLASS for view functionality
// Not working as a class at present

// class KeleView {
//  constructor() {
    // const Kele = require('Kele')
    // this.kele = new Kele()
//  }


// Create an instance of the Kele class
const kele = new Kele()
  

// Separately create all view functionality in methods
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
      
      // how to best handle this?
      await kele.initialize (email, password)
      console.log(`auth token retrieved: ${kele.authToken}`)
      
      await kele.getMe()
      console.log(kele.userObject)

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

    /*
    // Not yet working
    loginSubmit.addEventListener('keypress', function(event) {
        console.log(event)
        if (event.key === 'enter') {
          loginListener()
        }
    })
    */
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
            magicDiv.innerHTML = '     '
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

    /*
    // Not yet working
    roadmapSubmit.addEventListener('keypress', function(event) {
        console.log(event)
        if (event.key === 'enter') {
          refreshRoadmapView()
        }
    })
    */
  }
  
  async function setupCheckpointView () {
    const checkpointBox = document.getElementById('checkpoint')
    const checkpointInput = document.getElementById("checkpoint-input")
    const checkpointSubmit = document.getElementById('checkpoint-submit')
    const pointBox = document.getElementById("checkpoint-map")
    pointBox.className = 'point-box'
    
    async function refreshCheckpointView () {
      
      pointBox.innerHTML = ''
      const point = await kele.getCheckpoint(checkpointInput.value)

      // ERROR: "Sorry, you are not authorized to do that."
      if (point.name) {
        const pointName = document.createElement('h3')
        pointName.innerHTML = `${point.name}`
        pointBox.appendChild(pointName)
      } else {
        pointBox.innerHTML = "Sorry, Bloc doesn't authorize anyone to do this for some reason."
      }
    }
    
    checkpointSubmit.addEventListener('click', refreshCheckpointView)

    /*
    // Not yet working
    checkpointSubmit.addEventListener('keypress', function(event) {
        console.log(event)
        if (event.key === 'enter') {
          refreshCheckpointView()
        }
    })
    */
  }
  
  async function initialize () {
    await initializeView()
    await setupMentorView()
    await setupRoadmapView()
    await setupCheckpointView()
  }
// }

// const keleView = new KeleView()
// keleView.initalize()


// NOW call the summary method to initialize all view elements
initialize()