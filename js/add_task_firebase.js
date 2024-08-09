
const BASE_TASKS_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/';


async function fetchExistingTasks() {
  const response = await fetch(`${BASE_TASKS_URL}.json`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
}

async function adjustTaskIdsAndUpdate(existingTasks) {
  let tasksArray = existingTasks ? Object.keys(existingTasks).map(key => ({
    ...existingTasks[key],
    id: parseInt(key)
  })) : [];
  
  tasksArray.sort((a, b) => a.id - b.id);

  await Promise.all(tasksArray.map(async (task, index) => {
    if (task.id !== index) {
      task.id = index;
      const response = await fetch(`${BASE_TASKS_URL}/${index}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
  }));

  return tasksArray.length; 
}

function collectNewTaskData() {
  const taskData = collectData();
  if (!taskData) {
    console.error("No task data to send");
    return null;
  }
  return taskData;
}


async function sendNewTask(nextIndex, taskData) {
  const taskResponse = await fetch(`${BASE_TASKS_URL}/${nextIndex}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });

  if (!taskResponse.ok) {
    throw new Error(`HTTP error! Status: ${taskResponse.status}`);
  }

  return await taskResponse.json();
}

async function sendTaskDataToFirebase() {
  try {
    await initializeTasksNode();
    const existingTasks = await fetchExistingTasks();
    const nextIndex = await adjustTaskIdsAndUpdate(existingTasks);
    const taskData = collectNewTaskData();
    if (!taskData) return; 
    const responseAsJson = await sendNewTask(nextIndex, taskData);
  } catch (error) {
    console.error('Error saving data to Firebase:', error);
  }
}