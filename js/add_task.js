let selectedCategory = '';
let selectedPriority = 'Medium'; // Default priority set to Medium
let selectedContacts = [];

function openDropDownContacts() {
  let dropdown = document.getElementById('dropdownContacts');
  dropdown.innerHTML = `
    <div id="openedDropDownContacts" style="display:flex; flex-direction:column; width:100%;">
      <div class="categoryOption" onclick="closeDropDownContacts()">
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

function createContactOption(contact) {
  const isSelected = selectedContacts.includes(contact);
  return `
    <div class="contactOption ${isSelected ? 'selected' : ''}" onclick="toggleContact('${contact}')">
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
  updateDropDownContacts();
}

function closeDropDownContacts() {
  updateDropDownContacts();
}

function updateDropDownContacts() {
  let dropdown = document.getElementById('dropdownContacts');
  dropdown.innerHTML = `
    <div class="categoryOption" onclick="openDropDownContacts()">
      <span class="spanCategory">${selectedContacts.length > 0 ? selectedContacts.join(', ') : 'Select Contacts to assign'}</span>
      <img class="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="" onclick="openDropDownContacts()">
    </div>
  `;
}

function openDropDown() {
  let dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = `
    <div id="openedDropDown" style="display:flex; flex-direction:column; width:100%;">
      <div class="categoryOption" onclick="closeDropDown()">
        <span class="spanCategory">${selectedCategory || 'Select task category'}</span>
        <img class="dropUpImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
      </div>
      <span class="spanHover" onclick="selectCategory('Technical Task')">Technical Task</span>
      <span class="spanHover" onclick="selectCategory('User Story')">User Story</span>
    </div>
  `;
}

function selectCategory(category) {
  selectedCategory = category;
  let dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = `
    <div class="categoryOption" onclick="openDropDown()">
      <span class="spanCategory">${selectedCategory}</span>
      <img class="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="" onclick="openDropDown()">
    </div>
  `;
}

function closeDropDown() {
  let dropdown = document.getElementById('dropdown');
  dropdown.innerHTML = `
    <div class="categoryOption" onclick="openDropDown()">
      <span class="spanCategory">${selectedCategory || 'Select task category'}</span>
      <img class="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="" onclick="openDropDown()">
    </div>
  `;
}

let activeButton = null;
        
function handleClick(buttonNumber) {
    // Reset the previous active button
    if (activeButton !== null) {
        let previousButton = document.getElementById('button' + activeButton);
        let previousImage = document.getElementById('prioImg' + activeButton);
        
        previousButton.classList.add('hover-shadow');
        previousButton.style.backgroundColor = '';
        
        switch (activeButton) {
            case 1:
                previousImage.src = 'assets/img/svg/urgent.svg';
                break;
            case 2:
                previousImage.src = 'assets/img/svg/medium.svg';
                break;
            case 3:
                previousImage.src = 'assets/img/svg/low.svg';
                break;
        }
    }

    // Set the new active button
    activeButton = buttonNumber;
    let activeButtonElement = document.getElementById('button' + activeButton);
    let activeImage = document.getElementById('prioImg' + activeButton);

    activeButtonElement.classList.remove('hover-shadow');

    switch (buttonNumber) {
        case 1:
            activeButtonElement.style.backgroundColor = '#FF3D00';
            activeImage.src = 'assets/img/png/urgentWhite.png';
            break;
        case 2:
            activeButtonElement.style.backgroundColor = '#FFA800';
            activeImage.src = 'assets/img/png/mediumColor.png';
            break;
        case 3:
            activeButtonElement.style.backgroundColor = '#7AE229';
            activeImage.src = 'assets/img/png/lowWhite.png';
            break;
    }
}

function submitForm(event) {
  if (!validateForm()) {
    event.preventDefault(); // Prevent form submission if validation fails
  } else {
    document.getElementById('taskForm').submit();
  }
}

function validateForm() {
  const form = document.getElementById('taskForm');
  const inputs = form.querySelectorAll('input, textarea, select');
  let valid = true;

  // Remove previous invalid styles
  document.querySelectorAll('.inputContainer').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdown').classList.remove('invalid');

  // Check all input fields for validity
  inputs.forEach(input => {
    const parentP = input.closest('.inputContainer');
    if (input.required && !input.value.trim()) {
      valid = false;
      if (parentP) {
        parentP.classList.add('invalid');
      }
    }
  });

  // Check if a category has been selected
  if (!selectedCategory) {
    valid = false;
    document.getElementById('dropdown').classList.add('invalid'); // Add invalid class to dropdown
  } else {
    document.getElementById('dropdown').classList.remove('invalid');
  }

  return valid; // Return validation result
}

// Add event listeners to remove the red border when the user interacts with the input fields
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.inputContainer input, .inputContainer textarea, .inputContainer select');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.inputContainer').classList.remove('invalid');
    });
  });

  const dropdown = document.getElementById('dropdown');
  dropdown.addEventListener('click', () => {
    dropdown.classList.remove('invalid');
  });
});