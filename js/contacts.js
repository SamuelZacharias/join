let contacts = [];
let initials = [];


// Funktion zum Rendern der gesamten Kontaktliste
function renderContacts() {
  const contactList = document.getElementById('contactList');
  contactList.innerHTML = ''; // Vorherige Inhalte löschen

  // Kontakte nach Initialen gruppieren
  const groupedContacts = contacts.reduce((acc, contact, index) => {
      let nameParts = contact.name.split(' ');
      let initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
      let firstInitial = initials.charAt(0);

      if (!acc[firstInitial]) {
          acc[firstInitial] = [];
      }
      acc[firstInitial].push({ contact, initials, index });
      return acc;
  }, {});

  // Alphabetische Reihenfolge der Initialen
  const sortedInitials = Object.keys(groupedContacts).sort();

  // HTML für jede Gruppe von Initialen generieren
  sortedInitials.forEach(initial => {
      // letter-box für die Initialen hinzufügen
      contactList.innerHTML += generateLetterBox(initial);

      // Kontakte für diese Initialen hinzufügen
      groupedContacts[initial].forEach(({ contact, initials, index }) => {
          contactList.innerHTML += generateContact(contact, initials, index);
      });

      
  });
}


// Funktion zum Berechnen und Speichern der Initialen
function updateInitials() {
  initials = contacts.map(contact => {
      let nameParts = contact.name.split(' ');
      return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  });

  // Initialen im localStorage speichern
  localStorage.setItem('initials', JSON.stringify(initials));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function openDialog() {
  const dialogContainer = document.getElementById("dialog-contacts");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  await sleep(10);
  dialogContainer.classList.add("dialog-open");
  document.getElementById("grey-background").classList.remove("hidden");
}

async function closeDialog() {
  const dialogContainer = document.getElementById("dialog-contacts");
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey-background").classList.add("hidden");
  await sleep(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
}


async function openDialogEdit(index) {
  
  const contact = contacts[index];
  let nameParts = contact.name.split(' ');
  let initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  currentContactIndex = index;
  
  const dialogContainer = document.getElementById("dialog-edit");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  document.getElementById('inputEditName').value = contact.name;
  document.getElementById('inputEditEmail').value = contact.email;
  document.getElementById('inputEditPhone').value = contact.phone;
  document.getElementById('inputEditName').dataset.index = index;
  document.getElementById('inputEditEmail').dataset.index = index;
  document.getElementById('inputEditPhone').dataset.index = index;
  await sleep(10);
  dialogContainer.classList.add("dialog-open");
  document.getElementById("grey-background").classList.remove("hidden");
  document.getElementById('bigLetterCircle').innerHTML = generateBigLetterCircle(contact,initials);
}

async function closeDialogEdit() {
  const dialogContainer = document.getElementById("dialog-edit");
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey-background").classList.add("hidden");
  await sleep(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
}

async function openDialogSuccesfully() {
  const dialogContainer = document.getElementById("succesfullyCreated");
  
  // Verzögerung von 1 Sekunde, bevor der Dialog angezeigt wird
  setTimeout(async () => {
      // Dialog anzeigen
      dialogContainer.open = true;
      await sleep(300);
      dialogContainer.classList.add("dialog-open");
      dialogContainer.classList.add("d-flex");

      // Verzögerung von 2 Sekunden, bevor der Dialog ausgeblendet wird
      await sleep(1000); // 2000 Millisekunden = 2 Sekunden

      // Dialog wieder ausblenden
      dialogContainer.classList.remove("dialog-open");
      await sleep(300); // Kleine Verzögerung für die Animation
      dialogContainer.classList.remove("d-flex");
      dialogContainer.open = false;
  }, 300); // 1000 Millisekunden = 1 Sekunde
}

function addContact() {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let phone = document.getElementById('phone').value;

  if (name && email && phone) {
      // Generiere eine neue ID für den Kontakt
      let newId = Date.now(); // Zeitstempel als eindeutige ID

      let newContact = {
          id: newId,
          name: name,
          email: email,
          phone: phone,
          color: getRandomColor(), // Zufällige Farbe zuweisen
          initials: name.split(' ').map(part => part.charAt(0).toUpperCase()).join('') // Initialen berechnen
      };

      contacts.push(newContact);
      saveData(); // Kontakte speichern

      // Formular zurücksetzen
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('phone').value = '';

      renderContacts(); // Kontaktliste neu rendern
  } else {
      alert('Bitte füllen Sie alle Felder aus.');
  }
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function displayContactInfo(index) {
  const contact = contacts[index];
  let nameParts = contact.name.split(' ');
  let initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  const contactInfoDiv = document.querySelector('.contacts-info-box');
  contactInfoDiv.innerHTML = "";
  contactInfoDiv.innerHTML = generateContactInfo(contact, initials, index);
  document.getElementById('button-edit-dialog').innerHTML = generateDeleteButtonDialog(index);
  highlightContact(index);
}

function deleteContact(index) {
  contacts.splice(index, 1); // Entfernt den Kontakt aus dem Array
  renderContacts(); // Aktualisiert die Anzeige
  saveData();
  document.querySelector('.contacts-info-box').innerHTML = '';
}



function saveData() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
  localStorage.setItem('initials', JSON.stringify(initials));
}

// Funktion zum Laden von Kontakten und Initialen aus dem localStorage
function loadData() {
  const storedContacts = localStorage.getItem('contacts');
  const storedInitials = localStorage.getItem('initials');

  if (storedContacts) {
      contacts = JSON.parse(storedContacts);
  }
  if (storedInitials) {
      initials = JSON.parse(storedInitials);
  }
}


function editContact() {
  // Hole den Index aus dem data-Attribut des Eingabefeldes
  const index = document.getElementById('inputEditName').dataset.index;

  // Hol die aktualisierten Werte aus den Eingabefeldern
  const updatedName = document.getElementById('inputEditName').value;
  const updatedEmail = document.getElementById('inputEditEmail').value;
  const updatedPhone = document.getElementById('inputEditPhone').value;

  // Erstelle ein neues Kontaktobjekt mit den aktualisierten Werten
  const updatedContact = {
      ...contacts[index],
      name: updatedName,
      email: updatedEmail,
      phone: updatedPhone
  };

  // Ersetze das alte Kontaktobjekt in der Array durch das aktualisierte
  contacts[index] = updatedContact;

  // Speichere die aktualisierten Daten in localStorage
  localStorage.setItem('contacts', JSON.stringify(contacts));

  renderContacts();
  closeDialogEdit();
  displayContactInfo(index);
}

document.addEventListener('DOMContentLoaded', () => {
  loadData(); // Stellen sicher, dass Daten geladen sind
  renderContacts(); // Kontaktliste rendern
});

function highlightContact(index) {
  const contacts = document.getElementsByClassName('contacts');
  for (let i = 0; i < contacts.length; i++) {
      contacts[i].style.backgroundColor = '';
  }
  document.getElementById(`contact${index}`).style.backgroundColor = 'var(--gray)';
  document.getElementById(`contact${index}`).style.color = 'white';
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

function validateForm() {
  let isValid = true;

  // Name Validierung
  const nameInput = document.getElementById('name');
  if (!nameInput.value.match(/^[A-Za-z\s]+$/)) {
      setError(nameInput, 'Invalid name');
      isValid = false;
  } else {
      clearError(nameInput);
  }

  // Email Validierung
  const emailInput = document.getElementById('email');
  if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(emailInput, 'Invalid email');
      isValid = false;
  } else {
      clearError(emailInput);
  }

  // Telefonnummer Validierung
  const phoneInput = document.getElementById('phone');
  if (!phoneInput.value.match(/^\d+$/)) {
      setError(phoneInput, 'Invalid phone number');
      isValid = false;
  } else {
      clearError(phoneInput);
  }

  if (isValid) {
    addContact();
    closeDialog(); 
    openDialogSuccesfully();
  }
}

function validateEditForm() {
  let isValid = true;

  // Name Validierung
  const nameInput = document.getElementById('inputEditName');
  if (!nameInput.value.match(/^[A-Za-z\s]+$/)) {
      setError(nameInput, 'Invalid name');
      isValid = false;
  } else {
      clearError(nameInput);
  }

  // Email Validierung
  const emailInput = document.getElementById('inputEditEmail');
  if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(emailInput, 'Invalid email');
      isValid = false;
  } else {
      clearError(emailInput);
  }

  // Telefonnummer Validierung
  const phoneInput = document.getElementById('inputEditPhone');
  if (!phoneInput.value.match(/^\d+$/)) {
      setError(phoneInput, 'Invalid phone number');
      isValid = false;
  } else {
      clearError(phoneInput);
  }

  if (isValid) {
    editContact();
  }
}
