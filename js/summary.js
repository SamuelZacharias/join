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
    const now = new Date(); // Erstellen Sie ein neues Date-Objekt für die aktuelle Zeit
    const hours = now.getHours(); // Stunden aus dem Date-Objekt holen

    let greeting;

    if (hours < 12) {
        greeting = "Good morning"; // Begrüßung für die Zeit von 00:00 bis 11:59
    } else if (hours < 18) {
        greeting = "Good afternoon"; // Begrüßung für die Zeit von 12:00 bis 17:59
    } else {
        greeting = "Good evening"; // Begrüßung für die Zeit von 18:00 bis 23:59
    }

    return greeting;
}

function generateGreetingHTML() {
    const time = getGreeting(); // Aktuelle Begrüßung ermitteln
    // HTML-String mit der Begrüßung als Variable
    const htmlContent = `<div>
        <h1>${time}</h1>
    </div>`;
    return htmlContent;
}

console.log(generateGreetingHTML()); // Ausgabe des HTML-Inhalts

function updateGreeting() {
    const greeting = getGreeting();
    document.querySelector('.greetBox1').textContent = greeting + ',';
}

// Aktualisieren der Begrüßung, sobald die Seite geladen ist
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
    // Retrieve the tasks JSON string from localStorage
    let tasksFromStorage = localStorage.getItem('tasks');

    // Check if tasks data exists in localStorage
    if (tasksFromStorage) {
        // Parse the JSON string into an array
        const parsedTasks = JSON.parse(tasksFromStorage);

        // Clear the current tasks array
        tasks.length = 0;

        // Push the parsed tasks into the tasks array
        tasks.push(...parsedTasks);
    }
}

function countCompletedTasks() {
    // Use the filter method to count tasks where the 'column' is 'done'
    const completedTasksCount = tasks.filter(task => task.column === 'done').length;

    // Log the count of completed tasks
    console.log(`Number of completed tasks: ${completedTasksCount}`);

    return completedTasksCount;
}





window.onload = function () {
    updateGreeting();
    setFutureDate();
    loadTasksFromLocalStorage();
    document.getElementById('toDoCount').innerHTML = countCompletedTasks()
};