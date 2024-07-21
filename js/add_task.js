let clickCount = 0;
let choosenCategory = false;
let category = ["User Task", "Technical task"];
let activeButton = 2;

let contacts = {
  'firstname' : ["Biene", "Vladimir", "Ella","Peter", "Paul", "Albert","Walter"],
  'lastname' : ["Maya","Putin", "Bella", "Pan","Ivan", "Meyer", "White"]
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

  // Reset invalid class
  document.querySelectorAll('.inputContainer').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdownCategory').classList.remove('invalid');

  // Validate required inputs
  inputs.forEach(input => {
    const parentP = input.closest('.inputContainer');
    if (input.required && !input.value.trim()) {
      valid = false;
      if (parentP) {
        parentP.classList.add('invalid');
      }
    }
  });

  // Validate category
  if (!choosenCategory) {
    valid = false;
    document.getElementById('dropdownCategory').classList.add('invalid');
  }

  return valid;
}

function showCategory() {
  let categories = document.getElementById('categories');
  categories.innerHTML = `
      <div class="openedDropDown">
        <span class="spanHover" onclick="chooseUserStory()">${category[0]}</span>
        <span class="spanHover" onclick="chooseTechnical()"> ${category[1]}</span>
      </div>
    `; 
  document.getElementById('categories').classList.remove('d-none');
  document.getElementById('dropDownImg').classList.remove('dropDownImg');
  document.getElementById('dropDownImg').classList.add('dropUpImg');
  choosenCategory = false;
}

function chooseUserStory() {
  let chooseCategory = document.getElementById('dropdownCategory');
  chooseCategory.innerHTML = `
  <span onclick="showCategory()" class="spanCategory">${category[0]}</span>
  <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">`;
  document.getElementById('categories').classList.add('d-none');
  choosenCategory = true;
  clickCount = 0;
  document.getElementById('dropDownImg').classList.add('dropDownImg');

  // Remove invalid class when a category is chosen
  document.getElementById('dropdownCategory').classList.remove('invalid');
}

function chooseTechnical() {
  let chooseCategory = document.getElementById('dropdownCategory');
  chooseCategory.innerHTML = `
  <span onclick="showCategory()" class="spanCategory">${category[1]}</span>
  <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">`;
  document.getElementById('categories').classList.add('d-none');
  choosenCategory = true;
  clickCount = 0;
  document.getElementById('dropDownImg').classList.add('dropDownImg');

  // Remove invalid class when a category is chosen
  document.getElementById('dropdownCategory').classList.remove('invalid');
}

function hideCategory() {
  document.getElementById('categories').classList.add('d-none');
  clickCount = 0;
}

document.getElementById("dropdownCategory").addEventListener("click", function() {
  clickCount++;
  if (clickCount % 2 === 1) {
    showCategory();
  } else {
    hideCategory();
  }
});

function handleClickOutside(event) {
  const container = document.getElementById('dropdownCategory');
  if (!container.contains(event.target)) {
    hideCategory();
  }
}
document.addEventListener('click', handleClickOutside);

// Add event listeners to inputs for removing 'invalid' class on input change
document.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', function() {
    const parentP = input.closest('.inputContainer');
    if (parentP && input.value.trim()) {
      parentP.classList.remove('invalid');
    }
  });
});

// Add event listener for category dropdown to remove invalid class when a valid category is chosen
document.getElementById('dropdownCategory').addEventListener('click', function() {
  if (choosenCategory) {
    document.getElementById('dropdownCategory').classList.remove('invalid');
  }
});




let contactColors = [
  "#FF4646",
  "#FFE62B",
  "#FFBB2B",
  "#C3FF2B",
  "#0038FF",
  "#FFC701",
  "#FC71FF",
  "#FFA35E",
  "#FF745E",
  "#9327FF",
  "#00BEE8",
  "#1FD7C1",
  "#6E52FF",
  "#FF5EB3",
  "#FF7A00"
];

// Create an object to store the colors for each contact
let contactInitialColors = {};

// Precompute and store the colors for each contact
function assignColors() {
  for (let i = 0; i < contacts.firstname.length; i++) {
    let fullName = contacts.firstname[i] + " " + contacts.lastname[i];
    contactInitialColors[fullName] = contactColors[Math.floor(Math.random() * contactColors.length)];
  }
}

function showContacts() {
  let contactsContainer = document.getElementById('contacts');
  contactsContainer.innerHTML = ``;
  for (let x = 0; x < contacts.firstname.length; x++) {
    let fullName = contacts.firstname[x] + " " + contacts.lastname[x];
    let color = contactInitialColors[fullName];
    contactsContainer.innerHTML += `
      <div class="contactsOpen">
        <div class="contactInitials" style="background-color: ${color};">
          ${contacts.firstname[x].charAt(0)}${contacts.lastname[x].charAt(0)}
        </div>
        <div class="contactName">
          <span style="width:100%;">${contacts.firstname[x]} ${contacts.lastname[x]}</span>
          <img src="assets/img/png/Rectangle 5.png" alt="">
        </div>
      </div>
    `;
  }
}