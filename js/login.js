const BASE_URL = "https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/";

async function fetchContacts() {
    try {
        const response = await fetch(`${BASE_URL}/contacts.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const contacts = await response.json();
        return contacts;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    addLoginButtonListener();
    addGuestLoginListener();
    addRememberMeCheckboxListener();
    loadRememberedCredentials();
    addInputListeners();
});

function addLoginButtonListener() {
    document.querySelector('.logIn').addEventListener('click', function (event) {
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
            showInvalidMessage('invalid', 'Email or password invalid.', 'invalidEmail');
            showInvalidMessage('invalid', 'Email or password invalid.', 'invalidPassword');
        } else {
            validatePasswordAndLogin(data, emailIndex, password);
        }
    } else {
        alert('No users found in the database.');
    }
}

async function validatePasswordAndLogin(data, emailIndex, password) {
    if (data.password[emailIndex] === password) {
        localStorage.setItem('loggedInUserName', data.name[emailIndex]);
        localStorage.setItem('loggedInUserEmail', data.email[emailIndex]);
        const contacts = await fetchContacts();
        if (contacts) {
            localStorage.setItem('contacts', JSON.stringify(contacts));
        } else {
            console.error('Failed to fetch contacts');
        }
        window.location.href = 'summary.html';
    } else {
        showInvalidMessage('invalid', 'Email or password invalid.', 'invalidPassword');
        showInvalidMessage('invalid', 'Email or password invalid.', 'invalidEmail');
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
    document.querySelector('.guestLogIn').addEventListener('click', function (event) {
        localStorage.setItem('loggedInUserName', 'Guest');
    });
}

function addRememberMeCheckboxListener() {
    const rememberMeCheckbox = document.querySelector('.check input[type="checkbox"]');
    rememberMeCheckbox.addEventListener('change', function () {
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
    emailInput.addEventListener('input', function () {
        clearInvalidMessages();
    });
    passwordInput.addEventListener('input', function () {
        clearInvalidMessages();
    });
}


function clearInvalidMessages() {
    document.getElementById('invalid').innerHTML = '';
    document.getElementById('invalidEmail').classList.remove('invalid');
    document.getElementById('invalidPassword').classList.remove('invalid');
}








function animationCheck() {
    const overlay = document.querySelector('.overlay');
    if (sessionStorage.getItem('sessionStorageAnimation') === 'true') {
        if (overlay) {
            overlay.style.display = 'none';
        }
    } else {
        sessionStorage.setItem('sessionStorageAnimation', 'true');
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 3000);
    }
}
 

function animateOverlayUnder1000px(){
    let overlay = document.querySelector('.overlay')
    overlay.style.backgroundColor = 'transparent'
    if(window.innerWidth < 1000){
        overlay.classList.remove('animationOverlayDekstop')
        overlay.classList.add('animationOverlayDekstopUnder1000px')
    }
    setTimeout(() => {
        overlay.classList.add('d-none')
    }, 3000);
}

window.onload = function () {
    animationCheck()
    animateOverlayUnder1000px()
    if(window.innerWidth < 600){
        animateLogoUnder600px()
    }
    
};

function animateLogoUnder600px(){
    let overlay = document.querySelector('.overlay')
    overlay.style.backgroundColor = 'var(--gray)';
    let animatedIcon = document.querySelector('.animated-icon')
    animatedIcon.src = "/assets/img/png/Join logo vector.png";
    if(window.innerWidth < 600){
        overlay.classList.remove('animationOverlayDekstopUnder1000px')
        animatedIcon.classList.remove('animationLogoDekstop')
        animatedIcon.classList.add('animationLogoUnder600px')
    }
    setTimeout(() => {
        overlay.style.backgroundColor = 'transparent'
    }, 1600);
    setTimeout(() => {
        overlay.classList.add('d-none')
    }, 3000);
}
