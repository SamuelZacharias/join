document.addEventListener('DOMContentLoaded', () => {
    let loggedInUserName = localStorage.getItem('loggedInUserName');
    if (loggedInUserName) {
        console.log('Logged-in user name:', loggedInUserName);
        let greetNameElement = document.getElementById('greetName');
        if (greetNameElement) {
            greetNameElement.innerHTML = `${loggedInUserName}`;
        }
    } else {
        console.log('No logged-in user name found');
    }
});

function getGreeting() {
    const now = new Date();
    const hours = now.getHours(); 
    let greeting;
    if (hours < 12) {
        greeting = "Good morning"; 
    } else if (hours < 18) {
        greeting = "Good afternoon"; 
    } else {
        greeting = "Good evening"; 
    }
    return greeting;
}

function generateGreetingHTML() {
    const time = getGreeting(); 
    const htmlContent = `<div>
        <h1>${time}</h1>
    </div>`;
    return htmlContent;
}

function updateGreeting() {
    const greeting = getGreeting();
    document.querySelector('.greetBox1').textContent = greeting + ',';
}

window.onload = updateGreeting;

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function setFutureDate() {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    const formattedDate = formatDate(futureDate);
    document.querySelector('.date').textContent = formattedDate;
}

const tasks = [];

function loadTasksFromLocalStorage() {
    let tasksFromStorage = localStorage.getItem('tasks');
    if (tasksFromStorage) {
        const parsedTasks = JSON.parse(tasksFromStorage);
        tasks.length = 0;
        tasks.push(...parsedTasks);
    }
}

function countCompletedTasks() {
    const completedTasksCount = tasks.filter(task => task.column === 'done').length;
    return completedTasksCount;
}

function completedTaskstoDoCount() {
    const completedTaskstoDoCount = tasks.filter(task => task.column === 'toDo').length;
    return completedTaskstoDoCount;
}

function completedTasksInProgress() {
    const completedTasksInProgress = tasks.filter(task => task.column === 'inProgress').length;
    return completedTasksInProgress;
}

function completedTasksFeedback() {
    const completedTasksFeedback = tasks.filter(task => task.column === 'awaitFeedback').length;
    return completedTasksFeedback;
}

function completedTasksUrgent() {
    const completedTasksUrgent = tasks.filter(task => task.priority === 'Urgent').length;
    return completedTasksUrgent;
}

window.onload = function () {
    updateGreeting();
    setFutureDate();
    loadTasksFromLocalStorage();
    document.getElementById('doneCount').innerHTML = countCompletedTasks()
    document.getElementById('toDoCount').innerHTML = completedTaskstoDoCount()
    document.getElementById('inProgress').innerHTML = completedTasksInProgress()
    document.getElementById('awaitFeedback').innerHTML = completedTasksFeedback()
    document.getElementById('urgentCount').innerHTML = completedTasksUrgent()
    document.getElementById('board').innerHTML = tasks.length;
};