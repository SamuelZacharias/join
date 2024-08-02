const tasks = [];
const contacts = []

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


function loadTasksFromLocalStorage() {
    const savedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const validTasks = savedTasks.filter(task => task !== null);

    // Update tasks array with valid tasks
    tasks.length = 0;  
    tasks.push(...validTasks);

    // Update contacts array directly
    contacts.length = 0;
    contacts.push(...savedContacts);  // Spread savedContacts into the contacts array

    console.log('Loaded tasks:', tasks);
    console.log('Loaded contacts:', contacts);
}



function filterTasks() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const filteredTasks = tasks.filter(task => {
        return task.title.includes(searchInput) || task.description.toLowerCase().includes(searchInput);
    });
    renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(filteredTasks) {
    renderTasks(filteredTasks);
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

document.addEventListener('click', handleClickOutside);



function closeOpenedTask(){
    document.getElementById(`openedTaskContainer`).classList.add(`d-none`)
    document.getElementById('openedTaskContainer').classList.remove('openedTaskContainer')
    document.getElementById(`editTaskContainer`).classList.add(`d-none`)
    document.getElementById('editTaskContainer').classList.remove('openedTaskContainer')
}

function handleClickOutside(event) {
    const container = document.getElementById('openedTaskContainer');
        if(container.contains(event.target)){
        document.getElementById('openedTaskContainer').classList.add('d-none')
        
        container.classList.remove('openedTaskContainer')
        }

        const containerEdit = document.getElementById('editTaskContainer');
        if(containerEdit.contains(event.target)){
        document.getElementById('editTaskContainer').classList.add('d-none')
        
        containerEdit.classList.remove('openedTaskContainer')
        }

}

