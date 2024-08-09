const BASE_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/';

async function getTasksFromDataBase() {
  try {
      const response = await fetch(BASE_URL + '.json');
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
      const responseAsJson = await response.json();
      const tasksArray = Object.keys(responseAsJson)
          .filter(key => responseAsJson[key] !== null)
          .map(key => ({ id: key, ...responseAsJson[key] }));
      tasks.length = 0;
      tasks.push(...tasksArray);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks()
  } catch (error) {
      console.warn('There was a problem with the fetch operation:', error);
  }
}

async function updateTaskInFirebase(task) {
  try {
      const response = await fetch(`${BASE_URL}${task.id}.json`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
      });
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }
      const updatedTask = await response.json();
  } catch (error) {
      console.warn('There was a problem with the fetch operation:', error);
  }
}

async function sendTaskDataToFirebaseAddTask() {
  try {
    await initializeTasksNode();

    const tasksArray = await fetchAndSortTasksAddTask();
    await updateTaskIdsAddTask(tasksArray);
    
    const nextIndex = tasksArray.length;
    const taskData = collectData();
    if (!taskData) {
      throw new Error("No task data to send");
    }

    await saveNewTaskAddTask(taskData, nextIndex);
    getTasksFromDataBase();
  } catch (error) {
    console.warn('Error saving data to Firebase:', error);
  }
}

async function fetchAndSortTasksAddTask() {
  const response = await fetch(`${BASE_URL}.json`);
  if (!response.ok) {
    throw new Error(`HTTP error during fetch tasks! Status: ${response.status}`);
  }

  const existingTasks = await response.json();
  let tasksArray = existingTasks ? Object.keys(existingTasks).map(key => ({ ...existingTasks[key], id: parseInt(key) })) : [];

  tasksArray.sort((a, b) => a.id - b.id);
  return tasksArray;
}

async function updateTaskIdsAddTask(tasksArray) {
  const promises = tasksArray.map((task, index) => {
    if (task.id !== index) {
      task.id = index;
      return fetch(`${BASE_URL}/${index}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });
    }
  });

  await Promise.all(promises);
}

async function saveNewTaskAddTask(taskData, nextIndex) {
  const taskResponse = await fetch(`${BASE_URL}/${nextIndex}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });

  if (!taskResponse.ok) {
    throw new Error(`HTTP error during save task! Status: ${taskResponse.status}`);
  }

  return await taskResponse.json();
}

function updateTaskInFirebaseAndUI(updatedTask) {
  updateTaskInFirebase(updatedTask).then(() => {
      renderTasks();
      closeEdit();
      openTask(updatedTask);
  }).catch(error => {
      console.warn('Error updating task in Firebase:', error);
  });
  renderTasks();
  closeEdit();
  openTask(updatedTask);
}