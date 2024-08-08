let contacts = [];
let initials = [];
let colorIndex = 0;
let highlightedContactIndex = -1; // Store the index of the highlighted contact

const colors = [
  '#FF7A00',
  '#FF5EB3',
  '#9747FF',
  '#9327FF',
  '#00BEE8',
  '#1FD7C1',
  '#FF745E',
  '#FFA35E',
  '#FC71FF',
  '#FFC701',
  '#0038FF',
  '#C3FF2B',
  '#FFE62B',
  '#FF4646',
  '#FFBB2B'
];

const BASE_TASKS_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/contacts/';

// Funktion zum Rendern der gesamten Kontaktliste
function renderContacts() {
  const contactList = document.getElementById('contactList');
  contactList.innerHTML = ''; // Vorherige Inhalte löschen

  // Kontakte aus Firebase laden
  fetch(BASE_TASKS_URL + '.json')
    .then(response => response.json())
    .then(data => {
      if (data) {
        // Kontakte in das Array umwandeln
        contacts = Object.values(data);

        // Initialen-Array aktualisieren
        initials = contacts.map(contact => {
          let nameParts = contact.name.split(' ');
          return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
        });

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

        // Reapply the highlight if a contact is selected
        if (highlightedContactIndex >= 0) {
          highlightContact(highlightedContactIndex);
        }
      } else {
        console.log('Keine Kontakte gefunden.');
      }
    })
    .catch(error => {
      console.error('Fehler beim Laden der Daten:', error);
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
    let dialogResponse = document.getElementById('succesfullyDeleted')
  dialogResponse.innerHTML = `Contact was succesfully created`
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

async function openDialogSuccesfullySaved() {
  const dialogContainer = document.getElementById("succesfullyCreated");
    let dialogResponse = document.getElementById('succesfullyDeleted')
  dialogResponse.innerHTML = `Contact info has been updated`
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

async function openDialogSuccesfullyDeleted() {
  const dialogContainer = document.getElementById("succesfullyCreated");
  let dialogResponse = document.getElementById('succesfullyDeleted')
  dialogResponse.innerHTML = `Contact was succesfully deleted`
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
    let newId = Date.now(); // Zeitstempel als eindeutige ID

    let newContact = {
      id: newId,
      name: name,
      email: email,
      phone: phone,
      color: getNextColor(), // Farbe aus der festgelegten Liste zuweisen
      initials: name.split(' ').map(part => part.charAt(0).toUpperCase()).join('') // Initialen berechnen
    };

    contacts.push(newContact);
    saveData(); // Kontakte speichern
    storeFirstAndLastNames();
    // Formular zurücksetzen
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    renderContacts(); // Kontaktliste neu rendern
    loadData();
    let lastIndex = contacts.length - 1; // Get the index of the last added contact
    highlightContact(lastIndex); // Highlight the last added contact
    displayContactInfo(lastIndex)
  } else {
    alert('Bitte füllen Sie alle Felder aus.');
  }
}

function getNextColor() {
  const usedColors = contacts.map(contact => contact.color);
  let availableColors = colors.filter(color => !usedColors.includes(color));

  if (availableColors.length === 0) {
    // Alle Farben wurden mindestens einmal verwendet, jetzt doppelte Verwendung zulassen
    colorIndex = (colorIndex + 1) % colors.length;
    return colors[colorIndex];
  }

  // Nächste nicht verwendete Farbe auswählen
  const nextColor = availableColors[0];
  return nextColor;
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
  if (index < 0 || index >= contacts.length) return; // Sicherstellen, dass der Index gültig ist

  console.log(`Versuche, Kontakt an Index ${index} zu löschen`);

  // Kontakt aus dem Array entfernen
  contacts.splice(index, 1);

  // Geändertes Array in Firebase speichern
  fetch(BASE_TASKS_URL + '.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contacts)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Kontakt erfolgreich gelöscht', data);
    openDialogSuccesfullyDeleted()
    renderContacts(); 
    highlightContact(this)
    storeFirstAndLastNames();
    loadData();
    document.querySelector('.contacts-info-box').innerHTML = '';
  })
  .catch(error => {
    console.error('Fehler beim Löschen des Kontakts:', error);
  });
}

function saveData() {
  fetch(BASE_TASKS_URL + '.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contacts)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Daten erfolgreich gespeichert:', data);
  })
  .catch(error => {
    console.error('Fehler beim Speichern der Daten:', error);
  });
}

// Funktion zum Laden von Kontakten und Initialen aus dem localStorage
function loadData() {
  fetch(BASE_TASKS_URL + '.json')
    .then(response => response.json())
    .then(data => {
      if (data) {
        contacts = Object.values(data);
        initials = contacts.map(contact => contact.initials);
        storeFirstAndLastNames();
        renderContacts(); // Kontakte nach dem Laden rendern
      } else {
        console.log('Keine Kontakte gefunden.');
      }
    })
    .catch(error => {
      console.error('Fehler beim Laden der Daten:', error);
    });
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

  // Speichere die aktualisierten Daten in Firebase
  fetch(BASE_TASKS_URL + '.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contacts)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Daten erfolgreich gespeichert:', data);
    loadData(); // Kontakte neu laden
    closeDialogEdit();
    openDialogSuccesfullySaved()
    displayContactInfo(index)
    highlightContact(index); // Reapply highlight after editing
  })
  .catch(error => {
    console.error('Fehler beim Speichern der Daten:', error);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadData(); // Stellen sicher, dass Daten geladen sind
});

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

  // Vor- und Nachname Validierung (erlaubt Umlaute und Leerzeichen, erfordert mindestens zwei Wörter)
  const nameInput = document.getElementById('name');
  if (!nameInput.value.match(/^[A-Za-zÄäÖöÜüß]+\s+[A-Za-zÄäÖöÜüß]+$/) || nameInput.value.length > 23) {
      setError(nameInput, 'Ungültiger Name oder zu lang (Max Mustermann, max. 23 Zeichen)');
      isValid = false;
      nameInput.value = '';
  } else {
      clearError(nameInput);
  }

  // Email Validierung (überprüft auf gültiges E-Mail-Format, keine Einschränkung auf bestimmte Endungen)
  const emailInput = document.getElementById('email');
  if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(emailInput, 'Ungültige E-Mail (test@test.de)');
      isValid = false;
      emailInput.value = '';
  } else {
      clearError(emailInput);
  }

  // Telefonnummer Validierung (nur Zahlen erlaubt)
  const phoneInput = document.getElementById('phone');
  if (!phoneInput.value.match(/^\d+$/)) {
      setError(phoneInput, 'Ungültige Telefonnummer 0176 123 123');
      isValid = false;
      phoneInput.value = '';
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

  // Vor- und Nachname Validierung (erlaubt Umlaute und Leerzeichen, erfordert mindestens zwei Wörter)
  const nameInput = document.getElementById('inputEditName');
  if (!nameInput.value.match(/^[A-Za-zÄäÖöÜüß]+\s+[A-Za-zÄäÖöÜüß]+$/) || nameInput.value.length > 23) {
      setError(nameInput, 'Ungültiger Name oder zu lang (Max Mustermann, max. 23 Zeichen)');
      isValid = false;
      nameInput.value = '';
  } else {
      clearError(nameInput);
  }

  // Email Validierung (überprüft auf gültiges E-Mail-Format, keine Einschränkung auf bestimmte Endungen)
  const emailInput = document.getElementById('inputEditEmail');
  if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError(emailInput, 'Ungültige E-Mail');
      isValid = false;
      emailInput.value = '';
  } else {
      clearError(emailInput);
  }

  // Telefonnummer Validierung (nur Zahlen erlaubt)
  const phoneInput = document.getElementById('inputEditPhone');
  if (!phoneInput.value.match(/^\d+$/)) {
      setError(phoneInput, 'Ungültige Telefonnummer 0176 123 123');
      isValid = false;
      phoneInput.value = '';
  } else {
      clearError(phoneInput);
  }

  if (isValid) {
    editContact();
  }
}

// Function to extract and store first and last names separately
function storeFirstAndLastNames() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

function truncate(text, maxLength = 20) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

function highlightContact(index) {
  const contacts = document.getElementsByClassName('contacts');
  
  // Reset the styles for all contacts
  for (let i = 0; i < contacts.length; i++) {
    contacts[i].style.backgroundColor = '';
    contacts[i].style.color = 'black';
  }
  
  // Get the contact element to be highlighted
  const contactElement = document.getElementById(`contact${index}`);
  
  // Check if the contact element exists before trying to change its style
  if (contactElement) {
    contactElement.style.backgroundColor = 'var(--gray)';
    contactElement.style.color = 'white';
  } else {
    console.warn(`Contact with index ${index} does not exist.`);
  }
  
  // Store the highlighted contact index
  highlightedContactIndex = index;
}