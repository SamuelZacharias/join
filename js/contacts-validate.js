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

function validateNameContact() {
    const nameInput = document.getElementById('name');
    if (!nameInput.value.match(/^[A-Za-zÄäÖöÜüß]+\s+[A-Za-zÄäÖöÜüß]+$/) || nameInput.value.length > 23) {
        setError(nameInput, 'Max Mustermann, max. 23 Zeichen');
        nameInput.value = '';
        return false;
    } else {
        clearError(nameInput);
        return true;
    }
}

function validateEmailContact() {
    const emailInput = document.getElementById('email');
    if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError(emailInput, 'Ungültige E-Mail (test@test.de)');
        emailInput.value = '';
        return false;
    } else {
        clearError(emailInput);
        return true;
    }
}

function validatePhoneContact() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput.value.match(/^\d+$/)) {
        setError(phoneInput, 'Ungültige Telefonnummer 0176123123');
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
    if (!nameInput.value.match(namePattern) || nameInput.value.length > 23) {
        setError(nameInput, 'John Doe, max. 23 Zeichen');
        nameInput.value = '';
        return false;
    } else {
        clearError(nameInput);
        return true;
    }
}

function validateEmailContactEdit() {
    const emailInput = document.getElementById('inputEditEmail');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.match(emailPattern)) {
        setError(emailInput, 'Invalid E-Mail (test@test.de)');
        emailInput.value = '';
        return false;
    } else {
        clearError(emailInput);
        return true;
    }
}

function validatePhoneContactEdit() {
    const phoneInput = document.getElementById('inputEditPhone');
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