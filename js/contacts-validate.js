function validateForm() {
  let isValid = true;
  const nameInput = document.getElementById('name');
  if (!nameInput.value.match(/^[A-Za-zÄäÖöÜüß]+\s+[A-Za-zÄäÖöÜüß]+$/) || nameInput.value.length > 23) {
      setError(nameInput, 'Max Mustermann, max. 23 Zeichen');
      isValid = false;
      nameInput.value = '';
  } else {
      clearError(nameInput);
  }

  const emailInput = document.getElementById('email');
  if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(emailInput, 'Ungültige E-Mail (test@test.de)');
      isValid = false;
      emailInput.value = '';
  } else {
      clearError(emailInput);
  }

  const phoneInput = document.getElementById('phone');
  if (!phoneInput.value.match(/^\d+$/)) {
      setError(phoneInput, 'Ungültige Telefonnummer 0176123123');
      isValid = false;
      phoneInput.value = '';
  } else {
      clearError(phoneInput);
  }

  if (isValid) {
    addContact();
    closeDialog(); 
    openDialogContact("Contact was successfully created");
  }
}

function validateEditForm() {
  let isValid = true;
  const nameInput = document.getElementById('inputEditName');
  if (!nameInput.value.match(/^[A-Za-zÄäÖöÜüß]+\s+[A-Za-zÄäÖöÜüß]+$/) || nameInput.value.length > 23) {
      setError(nameInput, 'Max Mustermann, max. 23 Zeichen');
      isValid = false;
      nameInput.value = '';
  } else {
      clearError(nameInput);
  }

  const emailInput = document.getElementById('inputEditEmail');
  if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(emailInput, 'Ungültige E-Mail (test@test.de)');
      isValid = false;
      emailInput.value = '';
  } else {
      clearError(emailInput);
  }

  const phoneInput = document.getElementById('inputEditPhone');
  if (!phoneInput.value.match(/^\d+$/)) {
      setError(phoneInput, 'Ungültige Telefonnummer 0176123123');
      isValid = false;
      phoneInput.value = '';
  } else {
      clearError(phoneInput);
  }

  if (isValid) {
    editContact();
  }
}