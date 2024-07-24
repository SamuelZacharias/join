const BASE_URL = "https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/";

document.addEventListener('DOMContentLoaded', function() {
    addLoginButtonListener();
    addGuestLoginListener();
    addRememberMeCheckboxListener();
    loadRememberedCredentials();
    addInputListeners(); 
});

function addLoginButtonListener() {
    document.querySelector('.logIn').addEventListener('click', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('repeatPassword').value;
        checkEmailAndLogin(email, password);
    });
}

function checkEmailAndLogin(email, password) {
    fetch(`${BASE_URL}/registerInfo.json`)
        .then(response => response.json())
        .then(data => handleLoginResponse(data, email, password))
        .catch(error => handleLoginError(error));
}

function handleLoginResponse(data, email, password) {
    if (data && data.email) {
        const emailIndex = data.email.indexOf(email);
        if (emailIndex === -1) {
            showInvalidMessage('invalid', 'Email does not exist.', 'invalidEmail');
        } else {
            validatePasswordAndLogin(data, emailIndex, password);
        }
    } else {
        alert('No users found in the database.');
    }
}

function validatePasswordAndLogin(data, emailIndex, password) {
    if (data.password[emailIndex] === password) {
        alert('Successfully logged in.');
        localStorage.setItem('loggedInUserName', data.name[emailIndex]);
        window.location.href = 'summary.html';
    } else {
        showInvalidMessage('invalid', 'Incorrect password', 'invalidPassword');
    }
}

function showInvalidMessage(containerId, message, className) {
    document.getElementById(containerId).innerHTML = message;
    document.getElementById(className).classList.add('invalid');
}

function handleLoginError(error) {
    alert(`Error: ${error.message}`);
}

function addGuestLoginListener() {
    document.querySelector('.guestLogIn').addEventListener('click', function(event) {
        localStorage.setItem('loggedInUserName', 'Guest');
    });
}

function addRememberMeCheckboxListener() {
    const rememberMeCheckbox = document.querySelector('.check input[type="checkbox"]');
    rememberMeCheckbox.addEventListener('change', function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('repeatPassword').value;
        handleRememberMeChange(this.checked, email, password);
    });
}

function handleRememberMeChange(isChecked, email, password) {
    if (isChecked) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
    } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        document.getElementById('email').value = '';
        document.getElementById('repeatPassword').value = '';
    }
}

function loadRememberedCredentials() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail && rememberedPassword) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('repeatPassword').value = rememberedPassword;
        document.querySelector('.check input[type="checkbox"]').checked = true;
    } else {
        document.getElementById('email').value = '';
        document.getElementById('repeatPassword').value = '';
    }
}


function addInputListeners() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('repeatPassword');

    emailInput.addEventListener('input', function() {
        clearInvalidMessages();
    });

    passwordInput.addEventListener('input', function() {
        clearInvalidMessages();
    });
}


function clearInvalidMessages() {
    document.getElementById('invalid').innerHTML = '';
    document.getElementById('invalidEmail').classList.remove('invalid');
    document.getElementById('invalidPassword').classList.remove('invalid');
}