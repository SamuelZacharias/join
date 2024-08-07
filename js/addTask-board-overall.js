function showCategory() {
  let categories = document.getElementById('categories');
  categories.innerHTML =  returnShowCategoryOverallHtml()
  document.getElementById('categories').classList.remove('d-none');
  document.getElementById('dropDownImg').classList.remove('dropDownImg');
  document.getElementById('dropDownImg').classList.add('dropUpImg');
  choosenCategory = false;
}



function chooseCategory(index) {
  let chooseCategory = document.getElementById('dropdownCategory');
  chooseCategory.innerHTML = returnChooseCategoryOverallHTML(index)
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

function showContacts() {
  let container = document.getElementById('contacts');
  container.innerHTML = contacts.map((c, i) => returnShowContactsOverallHTML(c, i)).join('');
  Array.from(container.getElementsByClassName('contactsOpen')).forEach(el => {
    el.addEventListener('click', function() {
      let contact = contacts[this.getAttribute('data-index')];
      let selectedIndex = selectedContacts.findIndex(c => c.name === contact.name);
      selectedIndex === -1 ? selectedContacts.push(contact) : selectedContacts.splice(selectedIndex, 1);
      this.classList.toggle('selected');
      showAssignedContacts();
    });
  });
}

function toggleContacts() {
  let container = document.getElementById('contacts');
  let img = document.getElementById('dropDownContactsImg');
  if (container.classList.toggle('d-none')) {
    img.classList = 'dropDownImg';
  } else {
    img.classList = 'dropUpImg';
    showContacts();
  }
}

function renderAssignedContactsHTML(contact) {
  return `
    <div class="contactInitials" style="background-color: ${contact.color}; color:white;">
      ${contact.initials}
    </div>
  `;
}

function showAssignedContacts() {
  let container = document.getElementById('assignedContacts');
  container.innerHTML = '';
  let maxToShow = 5;
  let totalContacts = selectedContacts.length;
  for (let i = 0; i < Math.min(totalContacts, maxToShow); i++) {
    container.innerHTML += renderAssignedContactsHTML(selectedContacts[i]);
  }
  if (totalContacts > maxToShow) {
    let moreCount = totalContacts - maxToShow;
    console.log(`More contacts count: ${moreCount}`); 
    let moreContactsColor = "#e3e3e3"; 

    container.innerHTML += `
      <div class="contactInitials more-contacts" style="background-color: ${moreContactsColor};">
        +${moreCount}
      </div>
    `;
  }
}

function setMinDate() {
  const dateInputs = ['dateInputAddTask', 'dateInput']; // Array of IDs
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayDate = `${yyyy}-${mm}-${dd}`;
  dateInputs.forEach(id => {
    const dateInput = document.getElementById(id);
    if (dateInput) { // Check if the element exists
      dateInput.min = todayDate;
    }
  });
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
      case 4:
        previousImage.src = './assets/img/svg/urgent.svg';
        break;
      case 5:
        previousImage.src = './assets/img/png/mediumColor.png';
        break;
      case 6:
        previousImage.src = './assets/img/svg/low.svg';
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
    case 4:
      activeButtonElement.style.backgroundColor = '#FF3D00';
      activeImage.src = './assets/img/png/urgentWhite.png';
      break;
    case 5:
      activeButtonElement.style.backgroundColor = '#FFA800';
      activeImage.src = './assets/img/svg/medium.svg';
      break;
    case 6:
      activeButtonElement.style.backgroundColor = '#7AE229';
      activeImage.src = './assets/img/png/lowWhite.png';
      break;
  }
}




function collectData() {
  // Determine which form to use
  const form = document.getElementById('taskForm') || document.getElementById('taskFormAddTask');
  if (!form) {
    console.info('No form found');
    return;
  }

  const title = form.querySelector('input[type="text"]').value;
  const description = form.querySelector('textarea').value;
  const dueDate = form.querySelector('input[type="date"]').value;

  const categoryElement = document.getElementById('dropdownCategory').querySelector('span').innerText;

  // Default values based on the form type
  const assignedContacts = selectedContacts || [];
  const subtasks = (form.id === 'taskForm' ? subtaskInfos : addTaskBoardInfos || []).map(subtask => ({ title: subtask, completed: false }));

  let priority = '';
  switch (activeButton) {
    case 1 | 4:
      priority = 'Urgent';
      break;
    case 2 | 5:
      priority = 'Medium';
      break;
    case 3 | 6:
      priority = 'Low';
      break;
    default:
      console.error("Invalid activeButton value");
      return;
  }

  // Default column based on the form type
  const column = form.id === 'taskForm' ? 'toDo' : (addTaskColumn || 'toDo');

  return {
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    category: categoryElement,
    assignedContacts: assignedContacts,
    subtasks: subtasks,
    column: column,
  };
}



async function initializeTasksNode() {
  try {
    const response = await fetch(`https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/.json`);
    if (!response.ok) {
      throw new Error(`HTTP error during initialize tasks node! Status: ${response.status}`);
    }
    const existingTasks = await response.json();
    if (existingTasks === null) {
      // Initialize the 'tasks' node if it doesn't exist
      const initResponse = await fetch(BASE_TASKS_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!initResponse.ok) {
        throw new Error(`HTTP error during initialize tasks node PUT! Status: ${initResponse.status}`);
      }
      console.log('Tasks node initialized if not existing');
    }
  } catch (error) {
    console.info('Error initializing tasks node:', error);
  }
}