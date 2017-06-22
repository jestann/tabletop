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
      }
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
      }
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
  
  async initializeView {
    let email = ''
    let password = ''

    const loginBox = document.getElementsByClassName('login')[0]
    const emailBox = document.getElementById('input-email')
    const passwordBox = document.getElementById('input-password')
    const loginSubmit = document.getElementById('login-submit')

    const userBox = document.getElementsByClassName('user')[0]
    const userInfo = document.getElementById('user-info')
    
    const roadmapBox = document.getElementsByClassName('roadmap')[0]
    const checkpointBox = document.getElementsByClassName('checkpoint')[0]
    

    async loginListener () {
      email = emailBox.value
      password = passwordBox.value
      
      // how to best handle this?
      kele.authToken = await kele.initialize (email, password)
      console.log(`auth token retrieved: ${kele.authToken}`)
      
      kele.userObject = await kele.getMe(kele.authToken)
      console.log(kele.userObject)

      if (kele.userObject) {
        loginBox.className = 'login hidden'
        
        userBox.className = 'user'
        userInfo.innerHTML = `Welcome to Bloc ${kele.userObject.name}!`
        
        mentorBox.className = 'mentor'
        roadmapBox.className = 'roadmap'
        checkpointBox.className = 'checkpoint'
        
      } else {
        userBox.className = 'user error'
        userInfo.innerHTML = 'No user information available. Please try logging in again.'
      }
    }
        
    loginSubmit.addEventListener('click', loginListener)
  }
  
  async setupMentorView () {
  
    const mentorBox = document.getElementsByClassName('mentor')[0]
    const mentorSubmit = document.getElementById("mentor-submit");
    
    async refreshMentorView {
      const scheduleBox = document.getElementById("schedule-id");
      const wantBox = document.getElementById("want-box-id");
      
      const schedule = await kele.getMentorAvailability(kele.userObject.mentor_id)
      scheduleBox.innerHTML = ''
      wantBox.innerHTML = ''
      
      schedule.forEach((availObject) => {
        let timeBox = document.createElement('div')
        timeBox.className = 'timebox t-hover tabling'
        let start = document.createElement('p')
        start.innerHTML = `Starts At: ${availObject.starts_at}`
        let end = document.createElement('p')
        end.innerHTML = `Ends At: ${availObject.ends_at}`;
        let claim = document.createElement('div');
        claim.className = "timebox timebox-button";
        claim.innerHTML = "Claim this Spot!";
        timeBox.appendChild(start);
        timeBox.appendChild(end);
        timeBox.appendChild(claim);
      
        claim.addEventListener("click", function(event) {
          scheduleBox.childNodes.forEach((timeBox) => { 
            timeBox.childNodes[2].className = 'timebox timebox-button';
            timeBox.childNodes[2].innerHTML = "Claim this Spot!";
          })
          event.target.className = "timebox selected"
          event.target.innerHTML = "This spot claimed."
  
          let savedBox = document.createElement('div')
          savedBox.className = "timebox want-box tabling"
          let claimedIt = document.createElement('div')
          claimedIt.innerHTML = "This Time Reserved:"
          claimedIt.className = "want-box-claim"
          let startTime = document.createElement('p')
          startTime.innerHTML = `Starts At: ${availObject.starts_at}`
          let endTime = document.createElement('p');
          endTime.innerHTML = `Ends At: ${availObject.ends_at}`;
          savedBox.appendChild(claimedIt);
          savedBox.appendChild(startTime);
          savedBox.appendChild(endTime);
  
          wantBox.innerHTML = "";
          wantBox.appendChild(savedBox);
        })
  
        scheduleBox.appendChild(timeBox);
      }
    }
    
    refreshMentorView()
    mentorSubmit.addEventListener('click', refreshMentorView)
  }
  
  async initialize {
    await initializeView()
    await refreshMentorView()
    // refreshRoadmapView()
    // refreshCheckpointView()
  }
}

const keleView = new KeleView()
keleView.initalize()




/*
TESTING FINISHED ELEMENTS

// View functionality for roadmaps

let roadmapBox = document.getElementById("roadmap");
roadmapBox.innerHTML = "No roadmap information available.";
let roadmapSubmit = document.getElementById("roadmap-submit");

function updateRoadmap () {
  
  // FOR TESTING:
  // let authToken = "jjj";
  // let userObject = {};
  
  if (authToken && userObject) {
    roadmapBox.innerHTML = "";
    let roadmap = getRoadmap (roadmapId);
    
    // FOR TESTING:
    /*
    let roadmap = [
      { starts_at: 1, ends_at: 2 },
      { starts_at: 2, ends_at: 3 },
      { starts_at: 3, ends_at: 4 }
    ];
    
    
    roadmap.forEach((availObject) => {
      let timeBox = document.createElement('div');
      timeBox.className = "timebox t-hover";
      let start = document.createElement('p');
      start.innerHTML = `Starts At: ${availObject.starts_at}`;
      let end = document.createElement('p');
      end.innerHTML = `Ends At: ${availObject.ends_at}`;
      let claim = document.createElement('div');
      claim.className = "timebox timebox-button";
      claim.innerHTML = "Claim this Spot!";
      timeBox.appendChild(start);
      timeBox.appendChild(end);
      timeBox.appendChild(claim);
      
      claim.addEventListener("click", function(event) {
        scheduleBox.childNodes.forEach((timeBox) => { 
          timeBox.childNodes[2].className = 'timebox timebox-button';
          timeBox.childNodes[2].innerHTML = "Claim this Spot!";
        });
        event.target.className = "timebox selected";
        event.target.innerHTML = "This spot claimed.";

        let savedBox = document.createElement('div');
        savedBox.className = "timebox want-box";
        let claimedIt = document.createElement('div');
        claimedIt.innerHTML = "This Time Reserved:";
        claimedIt.className = "want-box-claim";
        let startTime = document.createElement('p');
        startTime.innerHTML = `Starts At: ${availObject.starts_at}`;
        let endTime = document.createElement('p');
        endTime.innerHTML = `Ends At: ${availObject.ends_at}`;
        savedBox.appendChild(claimedIt);
        savedBox.appendChild(startTime);
        savedBox.appendChild(endTime);

        wantBox.innerHTML = "";
        wantBox.appendChild(savedBox);
      });

      scheduleBox.appendChild(timeBox);
    });
  } else {
    scheduleBox.innerHTML = "No user information available."
  }
}

updateMentorSchedule();
mentorSubmit.addEventListener('click', updateMentorSchedule);


// View functionality for checkpoints

let checkpointBox = document.getElementById("checkpoint");
checkpointBox.innerHTML = "No checkpoint information available.";
let checkpointSubmit = document.getElementById("checkpoint-submit");

*/