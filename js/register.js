const BASE_URL = "https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/";

let registerInfo = {
  name: [],
  email: [],
  password: [],
  repeatPassword: []
};

async function fetchRegisterInfo() {
  try {
    let response = await fetch(BASE_URL + "registerInfo.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    if (data) {
      registerInfo = data; 
    }
  } catch (error) {
    console.error('Error fetching registerInfo from Firebase:', error);
  }
}


async function saveRegisterInfoToFirebase() {
  try {
    let response = await fetch(BASE_URL + "registerInfo.json", {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerInfo)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let responseAsJson = await response.json();
  } catch (error) {
    console.error('Error saving data to Firebase:', error);
  }
}


function addRegisterInfo(newRegisterInfo) {
  registerInfo.name.push(newRegisterInfo.name);
  registerInfo.email.push(newRegisterInfo.email);
  registerInfo.password.push(newRegisterInfo.password);
  registerInfo.repeatPassword.push(newRegisterInfo.repeatPassword);
}


function validateName(name) {
  let words = name.trim().split(/\s+/); 
  if (words.length !== 2) {
    document.getElementById('invalidName').classList.add('invalid'); 
    return false;
  } else {
    document.getElementById('invalidName').classList.remove('invalid'); 
    return true;
  }
}


async function handleFormSubmit(event) {
  event.preventDefault(); 
  const registerInfo = extractFormValues();
  if (!validateForm(registerInfo)) {
    return;
  }
  if (await isEmailInUse(registerInfo.email)) {
    displayEmailInUseError();
    return;
  }
  await submitRegistration(registerInfo);
}

function extractFormValues() {
  return {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    repeatPassword: document.getElementById('repeatPassword').value
  };
}

function validateForm(registerInfo) {
  if (!validateName(registerInfo.name)) {
    displayNameError();
    return false;
  }
  if (registerInfo.password !== registerInfo.repeatPassword) {
    displayPasswordMismatchError();
    return false;
  }
  return true;
}

function displayNameError() {
  document.getElementById('wrongRepeat').innerHTML = `Name must contain exactly two words`;
}

function displayPasswordMismatchError() {
  document.getElementById('wrongRepeat').innerHTML = `The passwords don't match`;
  document.getElementById('invalid').classList.add(`invalid`);
}

async function isEmailInUse(email) {
  await fetchRegisterInfo(); 
  return registerInfo.email.includes(email);
}

function displayEmailInUseError() {
  document.getElementById('wrongRepeat').innerHTML = `Email already in use!`;
  document.getElementById('invalidEmail').classList.add(`invalid`);
}

async function submitRegistration(registerInfo) {
  addRegisterInfo(registerInfo); 
  await saveRegisterInfoToFirebase(); 
  showSuccessMessage();
}


function showSuccessMessage() {
  let successButton = document.getElementById('signedUpCont');
  successButton.classList.remove('d-none');
  document.getElementById('signedUp').classList.add('animation')
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('form').addEventListener('submit', handleFormSubmit);
  document.getElementById('email').addEventListener('input', resetErrorState);
  document.getElementById('password').addEventListener('input', resetErrorState);
  document.getElementById('repeatPassword').addEventListener('input', resetErrorState);
  document.getElementById('name').addEventListener('input', resetErrorState); 
});


function showPassword() {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
    document.getElementById('visibility').src = "assets/img/png/visibility.png";
  } else {
    x.type = "password";
    document.getElementById('visibility').src = "assets/img/png/visibility_off.png";
  }
}

function resetErrorState() {
  document.getElementById('wrongRepeat').innerHTML = ''; 
  document.getElementById('invalid').classList.remove('invalid');
  document.getElementById('invalidEmail').classList.remove('invalid');  
  document.getElementById('invalidName').classList.remove('invalid'); 
}