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

// VIEW functionality for initialize

let email = "";
let password = "";
let authToken = "";
let emailBox = document.getElementById("email");
let passwordBox = document.getElementById("password");
let submit = document.getElementById("submit");
let returned = document.getElementById('returned');

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
});