const BASE_URL = "https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/";

let registerInfo = {
  name: [],
  email: [],
  password: [],
  repeatPassword: []
};

// Function to fetch existing registerInfo from Firebase
async function fetchRegisterInfo() {
  try {
    let response = await fetch(BASE_URL + "registerInfo.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    if (data) {
      registerInfo = data; // Update registerInfo with fetched data
      console.log('Register Info from Firebase:', registerInfo);
    }
  } catch (error) {
    console.error('Error fetching registerInfo from Firebase:', error);
  }
}

// Function to save registerInfo to Firebase
async function saveRegisterInfoToFirebase() {
  try {
    console.log('Saving data to Firebase:', registerInfo);
    let response = await fetch(BASE_URL + "registerInfo.json", {
      method: 'PUT', // Use 'PUT' to update/replace the entire registerInfo
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerInfo)
    });
    
    console.log('Firebase response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let responseAsJson = await response.json();
    console.log('Data saved to Firebase:', responseAsJson);
  } catch (error) {
    console.error('Error saving data to Firebase:', error);
  }
}

// Function to add new registration info to registerInfo object
function addRegisterInfo(newRegisterInfo) {
  registerInfo.name.push(newRegisterInfo.name);
  registerInfo.email.push(newRegisterInfo.email);
  registerInfo.password.push(newRegisterInfo.password);
  registerInfo.repeatPassword.push(newRegisterInfo.repeatPassword);
}

// Function to validate the name input
function validateName(name) {
  let words = name.trim().split(/\s+/); // Split name into words and trim extra spaces
  if (words.length !== 2) {
    document.getElementById('invalidName').classList.add('invalid'); // Add invalid class
    return false;
  } else {
    document.getElementById('invalidName').classList.remove('invalid'); // Remove invalid class
    return true;
  }
}

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission

  let registerName = document.getElementById('name').value;
  let registerEmail = document.getElementById('email').value;
  let registerPassword = document.getElementById('password').value;
  let registerRepeatPassword = document.getElementById('repeatPassword').value;

  // Validate name
  if (!validateName(registerName)) {
    document.getElementById('wrongRepeat').innerHTML = `Name must contain exactly two words`;
    return;
  }

  if (registerPassword !== registerRepeatPassword) {
    document.getElementById('wrongRepeat').innerHTML = `The passwords don't match`;
    document.getElementById('invalid').classList.add(`invalid`);
    return;
  }

  await fetchRegisterInfo(); // Fetch the latest register info from Firebase

  if (registerInfo.email.includes(registerEmail)) {
    document.getElementById('wrongRepeat').innerHTML = `Email already in use!`;
    document.getElementById('invalidEmail').classList.add(`invalid`);
    return;
  }

  let newRegisterInfo = {
    name: registerName,
    email: registerEmail,
    password: registerPassword,
    repeatPassword: registerRepeatPassword
  };

  console.log('New Register Info:', newRegisterInfo);
  addRegisterInfo(newRegisterInfo); // Add new registration info to registerInfo object
  await saveRegisterInfoToFirebase(); // Save updated registerInfo to Firebase

  // Optionally, save to localStorage (if needed)

  // Show success message and redirect
  showSuccessMessage();
}

// Function to show success message and redirect
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
  document.getElementById('name').addEventListener('input', resetErrorState); // Reset error state on name input
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
  document.getElementById('invalidName').classList.remove('invalid'); // Remove invalid class for name input
}