// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


// Retrieve Auth Token with initialize

function initialize (email, password) {
  const baseUrl = 'https://www.bloc.io/api/v1';
  fetch(`${baseUrl}/sessions`, {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({email: email, password: password})}
  ).then( 
    response => { response.json().then( data => { 
      const token = data.auth_token;
      if (token) { return token; }
      })
    }
  ).catch( error => { console.log(error) } );
}


// Retrieve users with getMe

function getMe (authToken) {
  fetch(`${baseUrl}/users/me`, {
    method: 'Get',
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
let submit = document.getElementById("submit");
let returned = document.getElementById('returned');

let user = document.getElementById("user");
let userId = document.getElementById("user-id");
let userEmail = document.getElementById("user-email");
let userCreatedAt = document.getElementById("user-created-at");

submit.addEventListener('click', function() {
  email = emailBox.value;
  password = passwordBox.value;
  authToken = initialize (email, password);
  // authToken = "babjasdjasklfjk";
  
  if (authToken !== undefined) {
    returned.innerHTML = `${authToken}`;
  } else {
    returned.innerHTML = "error retrieving token";
  }
  
  if (authToken) {
    userObject = getMe(authToken);
    // userObject = { id: "0000", email: "test@test.com", created_at: "today" };
    
    userId.innerHTML = `User ID: ${userObject.id}`;
    userEmail.innerHTML = `User Email: ${userObject.email}`;
    userCreatedAt.innerHTML = `User Created At: ${userObject.created_at}`;
  } else {
    userId.innerHTML = "No user information available.";
    userEmail.innerHTML = "";
    userCreatedAt.innerHTML = "";
  }
});