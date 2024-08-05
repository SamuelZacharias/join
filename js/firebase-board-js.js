const BASE_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/';


async function getTasksFromDataBase() {
  try {
      const response = await fetch(BASE_URL + '.json');
      if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
      }

      const responseAsJson = await response.json();
      console.log('Tasks fetched from database:', responseAsJson);

      const tasksArray = Object.keys(responseAsJson)
          .filter(key => responseAsJson[key] !== null)
          .map(key => ({ id: key, ...responseAsJson[key] }));

      // Clear and update the tasks array
      tasks.length = 0;
      tasks.push(...tasksArray);

      console.log('Tasks array:', tasks);

      // Update local storage
      localStorage.setItem('tasks', JSON.stringify(tasks));

      // Load tasks from local storage to ensure consistency
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
      console.log('Task updated in Firebase:', updatedTask);
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}

const BASE_TASKS_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/';



async function sendTaskDataToFirebaseAddTask() {
  try {
    await initializeTasksNode();
    console.log('Tasks node initialized');

    const response = await fetch(`${BASE_TASKS_URL}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error during fetch tasks! Status: ${response.status}`);
    }

    const existingTasks = await response.json();
    let tasksArray = existingTasks ? Object.keys(existingTasks).map(key => ({ ...existingTasks[key], id: parseInt(key) })) : [];
    console.log('Existing tasks fetched:', tasksArray);

    tasksArray.sort((a, b) => a.id - b.id);

    const promises = tasksArray.map((task, index) => {
      if (task.id !== index) {
        task.id = index;
        return fetch(`${BASE_TASKS_URL}/${index}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        });
      }
    });

    await Promise.all(promises);
    console.log('Task IDs updated if necessary');

    const nextIndex = tasksArray.length;
    const taskData = collectData();
    if (!taskData) {
      throw new Error("No task data to send");
    }
    console.log('Task data collected:', taskData);

    const taskResponse = await fetch(`${BASE_TASKS_URL}/${nextIndex}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    if (!taskResponse.ok) {
      throw new Error(`HTTP error during save task! Status: ${taskResponse.status}`);
    }

    let responseAsJson = await taskResponse.json();
    console.log('Data saved to Firebase:', responseAsJson);
    getTasksFromDataBase()
  } catch (error) {
    console.error('Error saving data to Firebase:', error);
  }
}

function updateTaskInFirebaseAndUI(updatedTask) {
  updateTaskInFirebase(updatedTask).then(() => {
      console.log('Task updated in Firebase.');
      renderTasks();
      closeEdit();
      openTask(updatedTask);
  }).catch(error => {
      console.error('Error updating task in Firebase:', error);
  });
  renderTasks();
  closeEdit();
  openTask(updatedTask);
}