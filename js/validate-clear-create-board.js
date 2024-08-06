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
  handleClick(2); 
  document.querySelectorAll('.inputContainerAddTask').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdownCategory').classList.remove('invalid');
  
}


function validateFormAddTaskBoard() {
  const form = document.getElementById('taskFormAddTask');
  const inputs = form.querySelectorAll('input, textarea, select');
  let valid = true;

  // First, remove invalid classes immediately
  document.querySelectorAll('.inputContainerAddTask').forEach(p => {
    p.classList.remove('invalid');
  });
  document.getElementById('dropdownCategory').classList.remove('invalid');

  // Validate inputs and add invalid class if necessary
  inputs.forEach(input => {
    const parentP = input.closest('.inputContainerAddTask');
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

  // Add timeout to remove 'invalid' class after 0.5 seconds
  setTimeout(() => {
    document.querySelectorAll('.invalid').forEach(element => {
      element.classList.remove('invalid');
    });
  }, 1000); // 500 milliseconds = 0.5 seconds

  return valid;
}

async function handleCreateButtonClick() {
  console.log('createwasclicked');

  if (validateFormAddTaskBoard()) {
    const taskData = collectData();
    if (taskData) {
      console.log('Task data collected:', taskData);
      try {
        await sendTaskDataToFirebaseAddTask(taskData); 
        console.log('Task data sent to Firebase successfully');
        clearForm()
        closeAddTaskBoard()
      } catch (error) {
        console.error('Failed to send task data to Firebase:', error); 
      }
    } else {
      console.error('Task data collection failed');
    }
  } else {
    console.error('Form validation failed');
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
      console.error("Element with id 'successContainer' not found");
      return;
  }
  
  if (!successMessageAddTask) {
      console.error("Element with id 'sucessMessageAddTask' not found");
      return;
  }

  successContainer.classList.remove('d-none');
  successMessageAddTask.innerHTML = `Your task was added to ${addTaskColumn}`;
  console.log('Success message shown');
  setTimeout(() => {
    successContainer.classList.add('d-none');
  }, 1000);
}