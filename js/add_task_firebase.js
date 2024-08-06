
const BASE_TASKS_URL = 'https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/tasks/';

async function sendTaskDataToFirebase() {
  try {
    await initializeTasksNode(); // Ensure the 'tasks' node exists

    // Fetch existing tasks to determine the next index
    const response = await fetch(`${BASE_TASKS_URL}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const existingTasks = await response.json();
    let tasksArray = existingTasks ? Object.keys(existingTasks).map(key => ({ ...existingTasks[key], id: parseInt(key) })) : [];

    // Sort tasks by their ids
    tasksArray.sort((a, b) => a.id - b.id);

    // Ensure task ids are sequential starting from 0
    tasksArray.forEach((task, index) => {
      if (task.id !== index) {
        task.id = index;
        fetch(`${BASE_TASKS_URL}/${index}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        });
      }
    });

    // Determine the next index
    const nextIndex = tasksArray.length;

    // Collect new task data
    const taskData = collectData();
    if (!taskData) {
      console.error("No task data to send");
      return;
    }

    // Send the new task with the determined index
    const taskResponse = await fetch(`${BASE_TASKS_URL}/${nextIndex}.json`, {
      method: 'PUT',
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