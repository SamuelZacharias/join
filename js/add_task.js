let selectedCategory = '';
let selectedPriority = 'Medium';
let selectedContacts = [];
let activeButton = 2;
let isContactsDropdownOpen = false;
let isCategoryDropdownOpen = false;

function openDropDownContacts() {
  const dropdown = document.getElementById('dropdownContacts');
  dropdown.innerHTML = `
    <div id="openedDropDownContacts" style="display:flex; flex-direction:column; width:100%;">
      <div class="categoryOption" id="contactsDropdownHeader" onclick="event.stopPropagation(); toggleDropDownContacts()">
        <span class="spanCategory">${selectedContacts.length > 0 ? selectedContacts.join(', ') : 'Select Contacts to assign'}</span>
        <img class="dropUpImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
      </div>
      ${createContactOption('TEST1')}
      ${createContactOption('TEST2')}
      ${createContactOption('TEST3')}
      ${createContactOption('TEST4')}
    </div>
  `;
  isContactsDropdownOpen = true;
  document.addEventListener('click', handleOutsideClickContacts);
}

function createContactOption(contact) {
  const isSelected = selectedContacts.includes(contact);
  return `
    <div class="contactOption ${isSelected ? 'selected' : ''}" onclick="event.stopPropagation(); toggleContact('${contact}')">
      <span class="spanHover">${contact}</span>
      <input type="checkbox" ${isSelected ? 'checked' : ''} onclick="event.stopPropagation(); toggleContact('${contact}')" />
    </div>
  `;
}

function toggleContact(contact) {
  if (selectedContacts.includes(contact)) {
    selectedContacts = selectedContacts.filter(c => c !== contact);
  } else {
    selectedContacts.push(contact);
  }
  updateContactsDropdownContent();
}

function updateContactsDropdownContent() {
  const dropdown = document.getElementById('dropdownContacts');
  if (dropdown) {
    dropdown.innerHTML = `
      <div id="openedDropDownContacts" style="display:flex; flex-direction:column; width:100%;">
        <div class="categoryOption" id="contactsDropdownHeader" onclick="event.stopPropagation(); toggleDropDownContacts()">
          <span class="spanCategory">${selectedContacts.length > 0 ? selectedContacts.join(', ') : 'Select Contacts to assign'}</span>
          <img class="dropUpImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
        </div>
        ${createContactOption('TEST1')}
        ${createContactOption('TEST2')}
        ${createContactOption('TEST3')}
        ${createContactOption('TEST4')}
      </div>
    `;
  }
}

function closeDropDownContacts() {
  const dropdown = document.getElementById('dropdownContacts');
  if (dropdown) {
    dropdown.innerHTML = `
      <div class="categoryOption" id="contactsDropdownHeader" onclick="event.stopPropagation(); toggleDropDownContacts()">
        <span class="spanCategory">${selectedContacts.length > 0 ? selectedContacts.join(', ') : 'Select Contacts to assign'}</span>
        <img class="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
      </div>
    `;
  }
  isContactsDropdownOpen = false;
  document.removeEventListener('click', handleOutsideClickContacts);
}

function toggleDropDownContacts() {
  if (isContactsDropdownOpen) {
    closeDropDownContacts();
  } else {
    openDropDownContacts();
  }
}

function handleOutsideClickContacts(event) {
  const dropdown = document.getElementById('dropdownContacts');
  const dropdownHeader = document.getElementById('contactsDropdownHeader');
  if (dropdown && !dropdown.contains(event.target) && !dropdownHeader.contains(event.target)) {
    closeDropDownContacts();
  }
}

function openDropDown() {
  const dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = `
    <div id="openedDropDown" style="display:flex; flex-direction:column; width:100%;">
      <div class="categoryOption" id="categoryDropdownHeader" onclick="event.stopPropagation(); toggleDropDown()">
        <span class="spanCategory">${selectedCategory || 'Select task category'}</span>
        <img class="dropUpImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
      </div>
      <span class="spanHover" onclick="selectCategory('Technical Task')">Technical Task</span>
      <span class="spanHover" onclick="selectCategory('User Story')">User Story</span>
    </div>
  `;
  isCategoryDropdownOpen = true;
  document.addEventListener('click', handleOutsideClickCategory);
}

function selectCategory(category) {
  selectedCategory = category;
  closeDropDown();
}

function closeDropDown() {
  const dropdown = document.getElementById('dropdown');
  if (dropdown) {
    dropdown.innerHTML = `
      <div class="categoryOption" id="categoryDropdownHeader" onclick="event.stopPropagation(); toggleDropDown()">
        <span class="spanCategory">${selectedCategory || 'Select task category'}</span>
        <img class="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
      </div>
    `;
  }
  isCategoryDropdownOpen = false;
  document.removeEventListener('click', handleOutsideClickCategory);
}

function toggleDropDown() {
  if (isCategoryDropdownOpen) {
    closeDropDown();
  } else {
    openDropDown();
  }
}

function handleOutsideClickCategory(event) {
  const dropdown = document.getElementById('dropdown');
  const dropdownHeader = document.getElementById('categoryDropdownHeader');
  if (dropdown && !dropdown.contains(event.target) && !dropdownHeader.contains(event.target)) {
    closeDropDown();
  }
}

function handleClick(buttonNumber) {
  if (activeButton !== null) {
    const previousButton = document.getElementById('button' + activeButton);
    const previousImage = document.getElementById('prioImg' + activeButton);
    
    previousButton.classList.add('hover-shadow');
    previousButton.style.backgroundColor = '';
    previousButton.style.color = '';
    previousButton.style.fontWeight = '';

    switch (activeButton) {
      case 1:
        previousImage.src = 'assets/img/svg/urgent.svg';
        break;
      case 2:
        previousImage.src = 'assets/img/png/mediumColor.png';
        break;
      case 3:
        previousImage.src = 'assets/img/svg/low.svg';
        break;
    }
  }

  activeButton = buttonNumber;
  const activeButtonElement = document.getElementById('button' + activeButton);
  const activeImage = document.getElementById('prioImg' + activeButton);

  activeButtonElement.classList.remove('hover-shadow');
  activeButtonElement.style.color = 'white';
  activeButtonElement.style.fontWeight = '600';

  switch (buttonNumber) {
    case 1:
      activeButtonElement.style.backgroundColor = '#FF3D00';
      activeImage.src = 'assets/img/png/urgentWhite.png';
      break;
    case 2:
      activeButtonElement.style.backgroundColor = '#FFA800';
      activeImage.src = 'assets/img/svg/medium.svg';
      break;
    case 3:
      activeButtonElement.style.backgroundColor = '#7AE229';
      activeImage.src = 'assets/img/png/lowWhite.png';
      break;
  }
}

function submitForm(event) {
  if (!validateForm()) {
    event.preventDefault();
  } else {
    document.getElementById('taskForm').submit();
  }
}

function validateForm() {
  const form = document.getElementById('taskForm');
  const inputs = form.querySelectorAll('input, textarea, select');
  let valid = true;

  document.querySelectorAll('.inputContainer').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdown').classList.remove('invalid');

  inputs.forEach(input => {
    const parentP = input.closest('.inputContainer');
    if (input.required && !input.value.trim()) {
      valid = false;
      if (parentP) {
        parentP.classList.add('invalid');
      }
    }
  });

  if (!selectedCategory) {
    valid = false;
    document.getElementById('dropdown').classList.add('invalid');
  }

  return valid;
}