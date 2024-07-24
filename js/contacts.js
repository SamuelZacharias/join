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

      // Kontakttrenner hinzufügen
      contactList.innerHTML += '<div class="contact-separator"></div>';
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
  // event.stopPropagation();
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
  
  const dialogContainer = document.getElementById("dialog-edit");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");

  // Eingabefelder mit den Kontaktinformationen füllen
  document.getElementById('inputEditName').value = contact.name;
  document.getElementById('inputEditEmail').value = contact.email;
  document.getElementById('inputEditPhone').value = contact.phone;

  // Index für den Speichern-Button speichern
  document.getElementById('inputEditName').dataset.index = index;
  document.getElementById('inputEditEmail').dataset.index = index;
  document.getElementById('inputEditPhone').dataset.index = index;

  await sleep(10);
  dialogContainer.classList.add("dialog-open");
  document.getElementById("grey-background").classList.remove("hidden");
}

async function closeDialogEdit() {
  const dialogContainer = document.getElementById("dialog-edit");
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey-background").classList.add("hidden");
  await sleep(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
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
  if (!contact) {
      console.error('Contact not found at index:', index);
      return;
  }

  let nameParts = contact.name.split(' ');
  let initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');

  const contactInfoDiv = document.querySelector('.contacts-info');
  contactInfoDiv.innerHTML = generateContactInfo(contact, initials, index);
}

function deleteContact(index) {
  contacts.splice(index, 1); // Entfernt den Kontakt aus dem Array
  renderContacts(); // Aktualisiert die Anzeige
  saveData();
  document.querySelector('.contacts-info').innerHTML = '';
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

  if (index === undefined || contacts[index] === undefined) {
      console.error('Invalid index or contact not found');
      return;
  }

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

