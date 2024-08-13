const tasks = [];
window.onload = updateGreeting;

document.addEventListener('DOMContentLoaded', () => {
    let loggedInUserName = localStorage.getItem('loggedInUserName');
    if (loggedInUserName) {
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



function formatDate(date) {
    // Format the date as needed, e.g., 'DD-MM-YYYY'
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function setFutureDate() {
    loadTasksFromLocalStorage();
    const urgentTasks = tasks.filter(task => task.priority === "Urgent");
    if (urgentTasks.length > 0) {
        const earliestUrgentTask = urgentTasks.reduce((earliest, current) => {
            return new Date(current.dueDate) < new Date(earliest.dueDate) ? current : earliest;
        });
        const futureDate = new Date(earliestUrgentTask.dueDate);
        const formattedDate = formatDate(futureDate);
        document.querySelector('.date').textContent = formattedDate;
    } else {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 14);
        const formattedDate = formatDate(futureDate);
        document.querySelector('.date').textContent = formattedDate;
    }
}

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
    const showGreeting = sessionStorage.getItem('ShowGreetingScreen') === 'true';

    if (window.innerWidth <= 850 && !showGreeting) {
        document.getElementById('greeting-container').style.display = 'flex';
        showGreetingMessage();
        
        setTimeout(function () {
            document.getElementById('greeting-container').style.display = 'none';
        }, 2000);

        sessionStorage.setItem('ShowGreetingScreen', 'true');
    } else {
        document.getElementById('greeting-container').style.display = 'none';
    }

    setFutureDate();
    loadTasksFromLocalStorage();
    document.getElementById('doneCount').innerHTML = countCompletedTasks();
    document.getElementById('toDoCount').innerHTML = completedTaskstoDoCount();
    document.getElementById('inProgress').innerHTML = completedTasksInProgress();
    document.getElementById('awaitFeedback').innerHTML = completedTasksFeedback();
    document.getElementById('urgentCount').innerHTML = completedTasksUrgent();
    document.getElementById('board').innerHTML = tasks.length;
};

function showGreetingMessage() {
    const greeting = getGreeting();
    document.getElementById('greeting').textContent = greeting + ',';
    document.getElementById('greeting-name').textContent = localStorage.getItem('loggedInUserName');
}