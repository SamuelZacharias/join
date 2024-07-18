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

// Function to handle form submission
async function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission

  let registerName = document.getElementById('name').value;
  let registerEmail = document.getElementById('email').value;
  let registerPassword = document.getElementById('password').value;
  let registerRepeatPassword = document.getElementById('repeatPassword').value;

  if (registerPassword !== registerRepeatPassword) {
    alert('Passwords do not match!');
    return;
  }

  await fetchRegisterInfo(); // Fetch the latest register info from Firebase

  if (registerInfo.email.includes(registerEmail)) {
    alert('Email already in use!');
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
  saveRegisterData(newRegisterInfo);

  // Show success message and redirect
  showSuccessMessage();
}

// Function to show success message and redirect
function showSuccessMessage() {
  const successButton = document.querySelector('.d-none');
  successButton.classList.remove('d-none');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 2000);
}

// Attach handleFormSubmit to form submission event
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('form').addEventListener('submit', handleFormSubmit);
});

// Function to save registerInfo to localStorage (optional)
function saveRegisterData(newRegisterInfo) {
  let registerData = JSON.parse(localStorage.getItem('registerData')) || [];
  registerData.push(newRegisterInfo);
  localStorage.setItem('registerData', JSON.stringify(registerData));
}

// Function to load registerInfo from localStorage (optional)
function loadRegisterData() {
  let registerDataAsText = localStorage.getItem('registerData');
  if (registerDataAsText) {
    return JSON.parse(registerDataAsText);
  }
  return [];
}