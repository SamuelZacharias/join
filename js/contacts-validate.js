function validateForm() {
    let isValid = true;
    if (!validateNameContact()) {
        isValid = false;
    }
    if (!validateEmailContact()) {
        isValid = false;
    }
    if (!validatePhoneContact()) {
        isValid = false;
    }
    if (isValid) {
        addContact();
        closeDialog();
        openDialogContact("Contact was successfully created");
    }
}

function setError(inputElement, message) {
    inputElement.dataset.originalPlaceholder = inputElement.placeholder;
    inputElement.placeholder = message;
    inputElement.classList.add('error');
  }
  
function clearError(inputElement) {
    if (inputElement.dataset.originalPlaceholder) {
        inputElement.placeholder = inputElement.dataset.originalPlaceholder;
    }
    inputElement.classList.remove('error');
}

function validateNameContact() {
    const nameInput = document.getElementById('name');
    nameInput.addEventListener('input', function() {
        clearError(nameInput);
    });
    if (!nameInput.value.match(/^[A-Za-zÄäÖöÜüß]+\s+[A-Za-zÄäÖöÜüß]+$/) || nameInput.value.length > 20) {
        setError(nameInput, 'John Doe 20 Letters');
        nameInput.value = '';
        return false;
    } else {
        clearError(nameInput);
        return true;
    }
    
}


function validateEmailContact() {
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        clearError(emailInput);
    });
    if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError(emailInput, '(test@test.test)');
        emailInput.value = '';
        return false;
    } else {
        clearError(emailInput);
        return true;
    }
}

function validatePhoneContact() {
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        clearError(phoneInput);
    });
    if (!phoneInput.value.match(/^\d+$/)) {
        setError(phoneInput, '(0176123123)');
        phoneInput.value = '';
        return false;
    } else {
        clearError(phoneInput);
        return true;
    }
}

function validateEditForm() {
    let isValid = true;
    if (!validateNameContactEdit()) {
        isValid = false;
    }
    if (!validateEmailContactEdit()) {
        isValid = false;
    }
    if (!validatePhoneContactEdit()) {
        isValid = false;
    }
    if (isValid) {
        editContact();
    }
}

function validateNameContactEdit() {
    const nameInput = document.getElementById('inputEditName');
    const namePattern = /^[A-Za-zÄäÖöÜüß]+\s+[A-Za-zÄäÖöÜüß]+$/;
    nameInput.addEventListener('input', function() {
        clearError(nameInput);
    });
    if (!nameInput.value.match(namePattern) || nameInput.value.length > 20) {
        setError(nameInput, 'John Doe 20 Letters');
        nameInput.value = '';
        return false;
    } else {
        clearError(nameInput);
        return true;
    }
}

function validateEmailContactEdit() {
    const emailInput = document.getElementById('inputEditEmail');
    emailInput.addEventListener('input', function() {
        clearError(emailInput);
    });
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.match(emailPattern)) {
        setError(emailInput, '(test@test.de)');
        emailInput.value = '';
        return false;
    } else {
        clearError(emailInput);
        return true;
    }
}

function validatePhoneContactEdit() {
    const phoneInput = document.getElementById('inputEditPhone');
    phoneInput.addEventListener('input', function() {
        clearError(phoneInput);
    });
    const phonePattern = /^\d+$/;
    if (!phoneInput.value.match(phonePattern)) {
        setError(phoneInput, 'Invalid Telefonnummer 0176123123');
        phoneInput.value = '';
        return false;
    } else {
        clearError(phoneInput);
        return true;
    }
}