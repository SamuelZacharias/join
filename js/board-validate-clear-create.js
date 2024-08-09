function clearForm() {
  const form = document.getElementById('taskFormAddTask');
  form.reset();
  document.getElementById('dropdownCategory').innerHTML = `
    <span class="spanCategory">Select task category</span>
    <img class="dropDownImg" id="dropDownImg" src="assets/img/png/arrow_drop_down (1).png" alt="">
  `;
  document.getElementById('assignedContacts').innerHTML = ``;
  document.getElementById('newSubtasksAddTask').innerHTML = ``;
  choosenCategory = false;
  clickCount = 0;
  selectedContacts = [];
  addTaskBoardInfos = [];
  handleClick(5)
}

function validateFormAddTaskBoard() {
  clearValidationErrors();
  const form = document.getElementById('taskFormAddTask');
  const inputs = form.querySelectorAll('input, textarea, select');
  const validInputs = validateInputFields(inputs);
  const validCategory = validateCategorySelection(choosenCategory);
  setTimeout(() => clearValidationErrors(), 2000);
  return validInputs && validCategory;
}

function validateCategorySelection(choosenCategory) {
  if (!choosenCategory) {
    document.getElementById('dropdownCategory').classList.add('invalid');
    return false;
  }
  return true;
}

function validateInputFields(inputs) {
  let valid = true;
  inputs.forEach(input => {
    const parentP = input.closest('.inputContainerAddTask');
    if (input.required && !input.value.trim()) {
      valid = false;
      parentP?.classList.add('invalid');
    }
    if (input.type === 'date' && new Date(input.value) < new Date().setHours(0, 0, 0, 0)) {
      valid = false;
      parentP?.classList.add('invalid');
    }
  });
  return valid;
}

function clearValidationErrors() {
  document.querySelectorAll('.inputContainerAddTask')
    .forEach(p => p.classList.remove('invalid'));
  document.getElementById('dropdownCategory')
    .classList.remove('invalid');
}

async function handleCreateButtonClick() {
  if (validateFormAddTaskBoard()) {
    const taskData = collectData();
    if (taskData) {
      try {
        await sendTaskDataToFirebaseAddTask(taskData); 
        clearForm()
        closeAddTaskBoard()
      } catch (error) {
        console.error('Failed to send task data to Firebase:', error); 
      }
    } else {
      console.error('Task data collection failed');
    }
  } 
}

function submitForm(event) {
  if (!validateFormAddTaskBoard()) {
    event.preventDefault();
  } else {
    document.getElementById('taskFormAddTask').submit();
  }
}

function showSuccessMessageAddTask() {
  const successContainer = document.getElementById('successContainer');
  const successMessageAddTask = document.getElementById('sucessMessageAddTask');
  if (!successContainer) {
      console.warn("Element with id 'successContainer' not found");
      return;
  }
  if (!successMessageAddTask) {
      console.warn("Element with id 'sucessMessageAddTask' not found");
      return;
  }
  successContainer.classList.remove('d-none');
  successMessageAddTask.innerHTML = `Your task was added to ${addTaskColumn}`;
  setTimeout(() => {
    successContainer.classList.add('d-none');
  }, 1000);
}