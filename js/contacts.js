let contacts = [];
let initials = [];
let colorIndex = 0;
let highlightedContactIndex = -1; 
const colors = ['#FF7A00','#FF5EB3','#9747FF','#9327FF','#00BEE8','#1FD7C1','#FF745E',
  '#FFA35E','#FC71FF','#FFC701','#0038FF','#C3FF2B','#FFE62B','#FF4646','#FFBB2B'
];

const BASE_TASKS_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/contacts/';

function renderContacts() {
  const contactList = document.getElementById('contactList');
  contactList.innerHTML = ''; 
  fetch(BASE_TASKS_URL + '.json')
    .then(response => response.json())
    .then(data => {
      if (data) {
        renderContactsContactInitials(data)
        renderContactsGroupedContacts()
        if (highlightedContactIndex >= 0) {
          highlightContact(highlightedContactIndex);
        }
      } 
    })
    .catch(error => {
      console.error('Fehler beim Laden der Daten:', error);
    });
}

function renderContactsContactInitials(data){
  contacts = Object.values(data);
  initials = contacts.map(contact => {
    let nameParts = contact.name.split(' ');
    return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  });
}

function renderContactsGroupedContacts(){
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
  renderContactsSortedInitials(groupedContacts)
}

function renderContactsSortedInitials(groupedContacts){
  const sortedInitials = Object.keys(groupedContacts).sort();
        sortedInitials.forEach(initial => {
          contactList.innerHTML += generateLetterBox(initial);
          groupedContacts[initial].forEach(({ contact, initials, index }) => {
            contactList.innerHTML += generateContact(contact, initials, index);
          });
        });
}

function updateInitials() {
  initials = contacts.map(contact => {
      let nameParts = contact.name.split(' ');
      return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  });
  localStorage.setItem('initials', JSON.stringify(initials));
}

function addContact() {
  const contactData = getContactData();
  if (contactData) {
    const newContact = createAndSaveContact(contactData);
    updateUI(newContact);
  } else {
    alert('Bitte füllen Sie alle Felder aus.');
  }
}

function getContactData() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  if (name && email && phone) {
    return { name, email, phone };
  } else {
    return null;
  }
}

function createAndSaveContact(contactData) {
  const newContact = {
    id: Date.now(),
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone,
    color: getNextColor(),
    initials: contactData.name.split(' ').map(part => part.charAt(0).toUpperCase()).join(''),
  };
  contacts.push(newContact);
  saveData();
  storeFirstAndLastNames();
  return newContact;
}

function updateUI(newContact) {
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phone').value = '';
  renderContacts();
  loadData();
  const lastIndex = contacts.length - 1;
  highlightContact(lastIndex);
  displayContactInfo(lastIndex);
}



function getNextColor() {
  const usedColors = contacts.map(contact => contact.color);
  let availableColors = colors.filter(color => !usedColors.includes(color));
  if (availableColors.length === 0) {
    colorIndex = (colorIndex + 1) % colors.length;
    return colors[colorIndex];
  }
  const nextColor = availableColors[0];
  return nextColor;
}

function displayContactInfo(index) {
  let contactinfo = document.querySelector('.rightInfoBox')
  contactinfo.style.display = 'block'
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
  if (index < 0 || index >= contacts.length) return; 
  contacts.splice(index, 1);
  fetch(BASE_TASKS_URL + '.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contacts)
  })
  .then(response => response.json())
  .then(data => {
    contactWasDeleted()
    document.querySelector('.contacts-info-box').innerHTML = '';
  })
  .catch(error => {
    console.error('Fehler beim Löschen des Kontakts:', error);
  });
  if(window.innerWidth < 600){
    setTimeout(() => {
      hideContactInfo()
    }, 1000);
    
  }
}

function contactWasDeleted(){
    openDialogContact("Contact was successfully deleted");
    renderContacts(); 
    highlightContact(this)
    storeFirstAndLastNames();
    loadData();
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
  .catch(error => {
    console.error('Fehler beim Speichern der Daten:', error);
  });
}

function loadData() {
  fetch(BASE_TASKS_URL + '.json')
    .then(response => response.json())
    .then(data => {
      if (data) {
        contacts = Object.values(data);
        initials = contacts.map(contact => contact.initials);
        storeFirstAndLastNames();
        renderContacts(); 
      } 
    })
    .catch(error => {
      console.error('Fehler beim Laden der Daten:', error);
    });
}

function editContact() {
  const index = document.getElementById('inputEditName').dataset.index;
  const updatedContact = getDataContactEdit(index);getDataContactEdit(index)
  contacts[index] = updatedContact;
  fetch(BASE_TASKS_URL + '.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contacts)
  })
  .then(response => response.json())
  .then(data => {
    contactWasEdited(index)
  })
  .catch(error => {
    console.error('Fehler beim Speichern der Daten:', error);
  });
}

function getDataContactEdit(index){
  const updatedName = document.getElementById('inputEditName').value;
  const updatedEmail = document.getElementById('inputEditEmail').value;
  const updatedPhone = document.getElementById('inputEditPhone').value;
  const updatedContact = {
      ...contacts[index],
      name: updatedName,
      email: updatedEmail,
      phone: updatedPhone
  };
  return updatedContact
}

function contactWasEdited(index){
  loadData(); 
  closeDialogEdit();
  openDialogContact("Contact info has been updated");
  displayContactInfo(index)
  highlightContact(index)
}

document.addEventListener('DOMContentLoaded', () => {
  loadData(); 
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
  for (let i = 0; i < contacts.length; i++) {
    contacts[i].style.backgroundColor = '';
    contacts[i].style.color = 'black';
  }
  const contactElement = document.getElementById(`contact${index}`);
  if (contactElement) {
    contactElement.style.backgroundColor = 'var(--gray)';
    contactElement.style.color = 'white';
  }
  highlightedContactIndex = index;
}

function hideContactInfo(){
  let contactInfoContainer = document.querySelector('.rightInfoBox')
  contactInfoContainer.style.display = "none"
  highlightedContactIndex = -1;
  renderContacts()
}

function showEditContactMobile() {
  let containerEditDeleteMobile = document.querySelector('.contact-box-edit-delete');
  let editContactPoints = document.querySelector('.editContactPoints');

  // Show the container
  containerEditDeleteMobile.style.display = "flex";

  // Define the click handler
  function handleClickOutside(event) {
    // Check if the click is outside both the container and the editContactPoints
    if (!containerEditDeleteMobile.contains(event.target) &&
        !editContactPoints.contains(event.target)) {
      containerEditDeleteMobile.style.display = "none"; // Hide the container
      document.removeEventListener('click', handleClickOutside); // Remove the event listener
    }
  }

  // Add the event listener to the document
  document.addEventListener('click', handleClickOutside);
}