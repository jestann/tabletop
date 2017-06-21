// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// initial data

const baseUrl = 'https://www.bloc.io/api/v1';


// Retrieve auth token with initialize

async function initialize (email, password) {
  try {
    let response = await fetch(`${baseUrl}/sessions`, {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({email: email, password: password})
    });
    let data = await response.json();
    if (data.auth_token) { return data.auth_token; }
  }
  catch(error) {
    console.log(error);
  }
}
// could this be a better way to write the initialize function?



// Retrieve users with getMe

function getMe (authToken) {
  fetch(`${baseUrl}/users/me`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'authorization': authToken},
    }
  ).then(
      response => { JSON.parse(response) }
  ).catch( error => { console.log(error) })
}



// VIEW functionality for initialize and getMe

let email = "";
let password = "";
let authToken = "";
let userObject = {};

let emailBox = document.getElementById("input-email");
let passwordBox = document.getElementById("input-password");
let loginSubmit = document.getElementById("login-submit");
let returned = document.getElementById('returned');

let user = document.getElementById("user");
let userId = document.getElementById("user-id");
userId.innerHTML = "No user information available."
let userEmail = document.getElementById("user-email");
let userCreatedAt = document.getElementById("user-created-at");

loginSubmit.addEventListener('click', function() {
  email = emailBox.value;
  password = passwordBox.value;
  authToken = initialize (email, password);
  
  // FOR TESTING:
  // authToken = "babjasdjasklfjk";
  
  if (authToken !== undefined) {
    returned.innerHTML = `${authToken}`;
  } else {
    returned.innerHTML = "error retrieving token";
  }
  
  if (authToken) {
    userObject = getMe(authToken);
    
    // FOR TESTING:
    // userObject = { id: "0000", email: "test@test.com", created_at: "today", mentor_id: 0 };
    
    userId.innerHTML = `User ID: ${userObject.id}`;
    userEmail.innerHTML = `User Email: ${userObject.email}`;
    userCreatedAt.innerHTML = `User Created At: ${userObject.created_at}`;
  } else {
    userId.innerHTML = "No user information available.";
    userEmail.innerHTML = "";
    userCreatedAt.innerHTML = "";
  }
});



// Retrieve mentor availability

function getMentorAvailability (mentorId) {
  if (authToken) {
    fetch(`${baseUrl}/mentors/${mentorId}/student_availability`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json', 'authorization': authToken},
      body: `{ "id": ${mentorId} }`
      }
    ).then(
        response => { response.map((obj) => JSON.parse(obj)) }
    ).catch( error => { console.log(error) })
  } else {
    return "authentication error";
  }
}


// Some view functionality for mentor availability

let scheduleBox = document.getElementById("schedule");
scheduleBox.innerHTML = "No user information available."
let wantBox = document.getElementById("want-box");
let mentorSubmit = document.getElementById("mentor-submit");

function updateMentorSchedule () {
  
  // FOR TESTING:
  // let authToken = "jjj";
  // let userObject = {};
  
  if (authToken && userObject) {
    let schedule = getMentorAvailability (userObject.mentor_id);
    scheduleBox.innerHTML = "";
    wantBox.innerHTML = "";

    // FOR TESTING:
    /*
    let schedule = [
      { starts_at: 1, ends_at: 2 },
      { starts_at: 2, ends_at: 3 },
      { starts_at: 3, ends_at: 4 }
    ];
    */
    
    schedule.forEach((availObject) => {
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



// move this to a module?
// Retrieve roadmaps

function getRoadmap (roadmapId) {
  if (authToken) {
    fetch(`${baseUrl}/roadmaps/${roadmapId}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json', 'authorization': authToken},
      body: `{ "id": ${roadmapId} }`
      }
    ).then(
        response => { response.map((obj) => JSON.parse(obj)) }
    ).catch( error => { console.log(error) })
  } else {
    return "authentication error";
  }
}
// I'm not sure exactly what kind of data this returns, 
// as the API docs suggest it's thes same return as mentor availability



// Retrieve checkpoints

function getCheckpoint (checkpointId) {
  if (authToken) {
    fetch(`${baseUrl}/checkpoints/${checkpointId}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json', 'authorization': authToken},
      body: `{ "id": ${checkpointId} }`
      }
    ).then(
        response => { response.map((obj) => JSON.parse(obj)) }
    ).catch( error => { console.log(error) })
  } else {
    return "authentication error";
  }
}


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