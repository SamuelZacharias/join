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

  
  document.querySelectorAll('.inputContainer').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdownCategory').classList.remove('invalid');

  
  inputs.forEach(input => {
    const parentP = input.closest('.inputContainer');
    if (input.required && !input.value.trim()) {
      valid = false;
      if (parentP) {
        parentP.classList.add('invalid');
      }
    }

    
    if (input.type === 'date') {
      const selectedDate = new Date(input.value);
      const today = new Date();
      
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        valid = false;
        if (parentP) {
          parentP.classList.add('invalid');
        }
      }
    }
  });

 
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

  
  document.getElementById('dropdownCategory').classList.remove('invalid');
}

function hideCategory() {
  document.getElementById('dropDownImg').classList.add('dropDownImg');
  document.getElementById('dropDownImg').classList.remove('dropUpImg')
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


document.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', function() {
    const parentP = input.closest('.inputContainer');
    if (parentP && input.value.trim()) {
      parentP.classList.remove('invalid');
    }
  });
});


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


let contactInitialColors = {};


function assignColors() {
  for (let i = 0; i < contacts.firstname.length; i++) {
    let fullName = contacts.firstname[i] + " " + contacts.lastname[i];
    contactInitialColors[fullName] = contactColors[Math.floor(Math.random() * contactColors.length)];
  }
}

let selectedContacts = [];

function showContacts() {
  let contactsContainer = document.getElementById('contacts');
  contactsContainer.innerHTML = ``;
  for (let x = 0; x < contacts.firstname.length; x++) {
    let fullName = contacts.firstname[x] + " " + contacts.lastname[x];
    let color = contactInitialColors[fullName];

   
    let isSelected = selectedContacts.some(c => c.firstname === contacts.firstname[x] && c.lastname === contacts.lastname[x]);
    let selectedClass = isSelected ? 'selected' : '';

    contactsContainer.innerHTML += `
      <div class="contactsOpen ${selectedClass}" data-index="${x}">
        <div class="contactInitials" style="background-color: ${color}; ">
          ${contacts.firstname[x].charAt(0)}${contacts.lastname[x].charAt(0)}
        </div>
        <div class="contactName">
          <span style="width:100%;">${contacts.firstname[x]} ${contacts.lastname[x]}</span>
          <img src="assets/img/png/Rectangle 5.png" alt="">
        </div>
      </div>
    `;
  }

  
  let contactElements = contactsContainer.getElementsByClassName('contactsOpen');
  for (let contactElement of contactElements) {
    contactElement.addEventListener('click', function() {
      let index = this.getAttribute('data-index');
      let contact = {
        firstname: contacts.firstname[index],
        lastname: contacts.lastname[index]
      };

      
      let selectedIndex = selectedContacts.findIndex(c => c.firstname === contact.firstname && c.lastname === contact.lastname);
      if (selectedIndex === -1) {
        
        selectedContacts.push(contact);
      } else {
        
        selectedContacts.splice(selectedIndex, 1);
      }

      
      this.classList.toggle('selected');
      showAssignedContacts();
    });
  }
}

function toggleContacts() {
  document.getElementById('dropDownContactsImg').classList = ('dropUpImg')
  let contactsContainer = document.getElementById('contacts');
  if (contactsContainer.classList.contains('d-none')) {
    contactsContainer.classList.remove('d-none');

    showContacts();
  } else {
    contactsContainer.classList.add('d-none');
    document.getElementById('dropDownContactsImg').classList = ('dropDownImg')
  }
}

function showAssignedContacts() {
  let assignedContactsContainer = document.getElementById('assignedContacts');
  assignedContactsContainer.innerHTML = ``;
  let maxContactsToShow = 5;

  for (let a = 0; a < Math.min(selectedContacts.length, maxContactsToShow); a++) {
    let fullName = selectedContacts[a].firstname + " " + selectedContacts[a].lastname;
    let color = contactInitialColors[fullName];
    assignedContactsContainer.innerHTML += `
      <div class="contactInitials" style="background-color: ${color}; color:white;">
        ${selectedContacts[a].firstname.charAt(0)}${selectedContacts[a].lastname.charAt(0)}
      </div>
    `;
  }

  if (selectedContacts.length > maxContactsToShow) {
    let moreCount = selectedContacts.length - maxContactsToShow;
    
    let moreContactsColor = "#999999"; 
    assignedContactsContainer.innerHTML += `
      <div class="contactInitials more-contacts" style="background-color: ${moreContactsColor};">
        +${moreCount} 
      </div>
    `;
  }
}

document.addEventListener('click', function(event) {
  let contactsContainer = document.getElementById('contacts');
  let dropdownContacts = document.getElementById('dropdownContacts');
  if (!contactsContainer.classList.contains('d-none') && !dropdownContacts.contains(event.target) && !contactsContainer.contains(event.target)) {
    contactsContainer.classList.add('d-none');
  }
});


let subtaskInfos = [];

function writeSubtask() {
  let subtaskArea = document.getElementById('subtaskContainer');
  subtaskArea.innerHTML = `
    <div class="addSubtask">
      <input type="text" name="" autofocus id="subtaskInput" minlength="3" required placeholder="Enter subtask"/>
      <div class="d-flex">
        <img src="assets/img/png/subtaskX.png" onclick="resetSubtask()" alt="" />
        <img src="assets/img/png/subtaskDone.png" onclick="addSubtask();" alt="" />
      </div>
    </div>
  `;

  // Add event listener for focusout event
  document.getElementById('subtaskInput').addEventListener('focusout', function() {
    if (!this.value.trim()) {
      resetSubtask();
    }
  });

  // Ensure the input gets focus again if clicked
  document.getElementById('subtaskInput').focus();
}

function addSubtask(){
  let subtaskInput = document.getElementById('subtaskInput');
  let subtaskInfo = subtaskInput.value;

  if (subtaskInfo.length < 3) {
    subtaskInput.value = ''; 
    subtaskInput.placeholder = 'Min 3 characters needed'; 
    subtaskInput.style.borderColor = 'red'; 
    subtaskInput.classList.add('error-placeholder'); 
    return; 
  } else {
    subtaskInput.placeholder = 'Enter subtask'; 
    subtaskInput.style.borderColor = ''; 
    subtaskInput.classList.remove('error-placeholder'); 
  }

  subtaskInfos.push(subtaskInfo);
  showSubtasks();
  resetSubtask();
}

function resetSubtask() {
  document.getElementById('subtaskContainer').innerHTML = `
    <p>
      <input type="text" autofocus name="" placeholder="Add new subtask" readonly onclick="writeSubtask()" />
      <img src="assets/img/png/Subtasks icons11.png" alt="" />
    </p>
  `;
}

function showSubtasks(){
  let newSubtask = document.getElementById('newSubtasks');
  newSubtask.innerHTML = '';
  for (let s = 0; s < subtaskInfos.length; s++) {
    newSubtask.innerHTML += `
      <div class="addSubtask" style="justify-content:space-between;">
        <div  onclick="editSubtask(${s})" >
          ${subtaskInfos[s]}
        </div>
        <div class="d-flex">
          <img src="assets/img/png/subtaskDone.png" onclick="showSubtasks()" alt="" />
          <img src="assets/img/png/delete.png" onclick="deleteSubtask(${s})" alt="" />
        </div>
      </div>
    `;
  }
}

function editSubtask(index) {
  let newSubtask = document.getElementById('newSubtasks');
  newSubtask.innerHTML = '';
  for (let s = 0; s < subtaskInfos.length; s++) {
    if (s === index) {
      newSubtask.innerHTML += `
        <div class="addSubtask" ; justify-content:space-between;">
          <input type="text" id="editSubtaskInput" value="${subtaskInfos[s]}" minlength="3" required />
          <div class="d-flex">
            <img src="assets/img/png/subtaskDone.png" onclick="saveSubtask(${s})" alt="" />
            <img src="assets/img/png/delete.png" onclick="deleteSubtask(${s})" alt="" />
          </div>
        </div>
      `;
    } else {
      newSubtask.innerHTML += `
        <div class="addSubtask" ; justify-content:space-between;">
          <div style="width:100%" onclick="editSubtask(${s})"  >
            ${subtaskInfos[s]}
          </div>
          <div class="d-flex">
            <img src="assets/img/png/subtaskDone.png" onclick="showSubtasks()" alt="" />
            <img src="assets/img/png/delete.png" onclick="deleteSubtask(${s})" alt="" />
          </div>
        </div>
      `;
    }
  }
}

function saveSubtask(index) {
  let editInput = document.getElementById('editSubtaskInput');
  let editedSubtask = editInput.value;

  if (editedSubtask.length < 3) {
    editInput.value = ''; 
    editInput.placeholder = 'Min 3 characters needed'; 
    editInput.style.borderColor = 'red'; 
    editInput.classList.add('error-placeholder'); 
    return; 
  } else {
    editInput.placeholder = ''; 
    editInput.style.borderColor = ''; 
    editInput.classList.remove('error-placeholder'); 
  }

  subtaskInfos[index] = editedSubtask;
  showSubtasks();
}

function deleteSubtask(index) {
  subtaskInfos.splice(index, 1);
  showSubtasks();
}





function setMinDate() {
  const dateInput = document.getElementById('dateInput');
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayDate = `${yyyy}-${mm}-${dd}`;

  dateInput.min = todayDate;
}





document.querySelector('.createButton').addEventListener('click', async function(event) {
  event.preventDefault(); 

  if (validateForm()) {
    collectData(); 

    try {
      await sendTaskDataToFirebase(); 

     
      showSuccessMessage() 

    } catch (error) {
      console.error('Failed to send task data to Firebase:', error); 
    }
  } 
});



document.getElementById('clearButton').addEventListener('click', function(event) {
  event.preventDefault();
  const form = document.getElementById('taskForm');
  form.reset();
  document.getElementById('dropdownCategory').innerHTML = `
    <span class="spanCategory">Select task category</span>
    <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
  `;
  document.getElementById('assignedContacts').innerHTML = ``;
  document.getElementById('newSubtasks').innerHTML = ``;
  choosenCategory = false;
  clickCount = 0;
  selectedContacts = [];
  subtaskInfos = [];
  handleClick(2); 
  document.querySelectorAll('.inputContainer').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdownCategory').classList.remove('invalid');
});


const BASE_TASKS_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/';

// Collect task data
function collectData() {
  const form = document.getElementById('taskForm');
  if (!form) {
    return;
  }

  const title = form.querySelector('input[type="text"]').value;
  const description = form.querySelector('textarea').value;
  const dueDate = form.querySelector('input[type="date"]').value;
  const categoryElement = document.getElementById('dropdownCategory').querySelector('span').innerText;

  const assignedContacts = selectedContacts.map(contact => `${contact.firstname} ${contact.lastname}`);
  
  // Set 'completed' to false for each subtask
  const subtasks = subtaskInfos.map(subtask => ({ title: subtask, completed: false }));

  let priority = '';
  switch (activeButton) {
    case 1:
      priority = 'Urgent';
      break;
    case 2:
      priority = 'Medium';
      break;
    case 3:
      priority = 'Low';
      break;
    default:
      console.error("Invalid activeButton value");
      return;
  }

  return {
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    category: categoryElement,
    assignedContacts: assignedContacts,
    subtasks: subtasks,
    column: 'toDo',
  };
}

// Initialize tasks node if it doesn't exist
async function initializeTasksNode() {
  try {
    const response = await fetch(`${BASE_TASKS_URL}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const existingTasks = await response.json();
    if (existingTasks === null) {
      // Initialize the 'tasks' node if it doesn't exist
      await fetch(BASE_TASKS_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
    }
  } catch (error) {
    console.error('Error initializing tasks node:', error);
  }
}

// Send task data to Firebase
async function sendTaskDataToFirebase() {
  try {
    await initializeTasksNode(); // Ensure the 'tasks' node exists

    // Fetch existing tasks to determine the next index
    const response = await fetch(`${BASE_TASKS_URL}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const existingTasks = await response.json();
    const nextIndex = existingTasks ? Object.keys(existingTasks).length : 0; // Determine the next index

    // Collect new task data
    const taskData = collectData();
    if (!taskData) {
      console.error("No task data to send");
      return;
    }

    // Send the new task with the determined index
    const taskResponse = await fetch(`${BASE_TASKS_URL}/${nextIndex}.json`, {
      method: 'PUT', // Use PUT to create a new task at the specific index
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    if (!taskResponse.ok) {
      throw new Error(`HTTP error! Status: ${taskResponse.status}`);
    }

    let responseAsJson = await taskResponse.json();
    console.log('Data saved to Firebase:', responseAsJson);
  } catch (error) {
    console.error('Error saving data to Firebase:', error);
  }
}


function showSuccessMessage() {
  let successButton = document.getElementById('signedUpCont');
  successButton.classList.remove('d-none');
  document.getElementById('signedUp').classList.add('animation')
  setTimeout(() => {
    window.location.href = 'board.html';
  }, 3000);
}