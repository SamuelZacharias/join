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

function resetPreviousButton(activeButton) {
  if (activeButton === null) return;
  const previousButton = document.getElementById('button' + activeButton);
  const previousImage = document.getElementById('prioImg' + activeButton);
  previousButton.classList.add('hover-shadow');
  previousButton.style = '';
  previousImage.src = getImageSource(activeButton, false);
}

function updateActiveButton(buttonNumber) {
  const activeButtonElement = document.getElementById('button' + buttonNumber);
  const activeImage = document.getElementById('prioImg' + buttonNumber);
  activeButtonElement.classList.remove('hover-shadow');
  activeButtonElement.style.color = 'white';
  activeButtonElement.style.fontWeight = '600';
  activeButtonElement.style.backgroundColor = getButtonColor(buttonNumber);
  activeImage.src = getImageSource(buttonNumber, true);
}

function handleClick(buttonNumber) {
  resetPreviousButton(activeButton);
  activeButton = buttonNumber;
  updateActiveButton(buttonNumber);
}

function getButtonColor(buttonNumber) {
  switch (buttonNumber) {
    case 1:
    case 4:
      return '#FF3D00';
    case 2:
    case 5:
      return '#FFA800';
    case 3:
    case 6:
      return '#7AE229';
  }
}

function getImageSource(buttonNumber, isActive) {
  const state = isActive ? 'White' : '';
  switch (buttonNumber) {
    case 1:
      return `assets/img/${isActive ? 'png' : 'svg'}/urgent${state}.${isActive ? 'png' : 'svg'}`;
    case 2:
      return `assets/img/${isActive ? 'svg' : 'png'}/medium${state ? '' : 'Color'}.${isActive ? 'svg' : 'png'}`;
    case 3:
      return `assets/img/${isActive ? 'png' : 'svg'}/low${state}.${isActive ? 'png' : 'svg'}`;
    case 4:
      return `./assets/img/${isActive ? 'png' : 'svg'}/urgent${state}.${isActive ? 'png' : 'svg'}`;
    case 5:
      return `./assets/img/${isActive ? 'svg' : 'png'}/medium${state ? '' : 'Color'}.${isActive ? 'svg' : 'png'}`;
    case 6:
      return `./assets/img/${isActive ? 'png' : 'svg'}/low${state}.${isActive ? 'png' : 'svg'}`;
  }
}

function collectData() {
  const form = getFormAddTask();
  if (!form) return console.info('No form found');

  return {
    title: getInputValueAddTask(form, 'input[type="text"]'),
    description: getInputValueAddTask(form, 'textarea'),
    dueDate: getInputValueAddTask(form, 'input[type="date"]'),
    priority: getPriorityAddTask(activeButton),
    category: getCategoryAddTask(),
    assignedContacts: getAssignedContactsAddTask(),
    subtasks: getSubtasksAddTask(form),
    column: getColumnAddTask(form)
  };
}

function getFormAddTask() {
  return document.getElementById('taskForm') || document.getElementById('taskFormAddTask');
}

function getInputValueAddTask(form, selector) {
  return form.querySelector(selector).value;
}

function getPriorityAddTask(activeButton) {
  switch (activeButton) {
    case 1:
    case 4:
      return 'Urgent';
    case 2:
    case 5:
      return 'Medium';
    case 3:
    case 6:
      return 'Low';
    default:
      console.error("Invalid activeButton value");
      return '';
  }
}

function getCategoryAddTask() {
  return document.getElementById('dropdownCategory').querySelector('span').innerText;
}

function getAssignedContactsAddTask() {
  return selectedContacts || [];
}

function getSubtasksAddTask(form) {
  const subtasks = form.id === 'taskForm' ? subtaskInfos : addTaskBoardInfos || [];
  return subtasks.map(subtask => ({ title: subtask, completed: false }));
}

function getColumnAddTask(form) {
  return form.id === 'taskForm' ? 'toDo' : (addTaskColumn || 'toDo');
}

async function initializeTasksNode() {
  try {
    const existingTasks = await fetchTasks();
    if (existingTasks === null) {
      await initializeTasks();
    }
  } catch (error) {
    console.info('Error initializing tasks node:', error);
  }
}

async function fetchTasks() {
  const response = await fetch(`https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/.json`);
  if (!response.ok) {
    throw new Error(`HTTP error during initialize tasks node! Status: ${response.status}`);
  }
  return await response.json();
}

async function initializeTasks() {
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