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

function loadTasksFromLocalStorage() {
    // Standardmäßig leere Arrays, falls nichts im localStorage gefunden wird
    let toDo = [];
    let inProgress = [];
    let awaitFeedback = [];
    let done = [];

    // Versuchen, die Daten aus dem localStorage zu laden
    const tasksJSON = localStorage.getItem('tasks');
    if (tasksJSON) {
        const tasks = JSON.parse(tasksJSON);

        // Die Informationen in den Arrays aufteilen
        tasks.forEach(task => {
            if (task.column === 'toDo') {
                toDo.push(task);
            } else if (task.column === 'inProgress') {
                inProgress.push(task);
            } else if (task.column === 'awaitFeedback') {
                awaitFeedback.push(task);
            } else if (task.column === 'done') {
                done.push(task);
            }
        });
    }

    return { toDo, inProgress, awaitFeedback, done };
}

function displayTasks() {
    const tasks = loadTasksFromLocalStorage();

    // Funktion zum Erstellen von Listenelementen
    const createListItems = (tasks) => {
        return tasks.map(task => `<li>${task.title}</li>`).join('');
    };

    // Zuordnen der Aufgaben zu den entsprechenden HTML-Elementen
    document.getElementById('toDoCount').innerHTML = createListItems(tasks.toDo);
    document.getElementById('inProgressCount').innerHTML = createListItems(tasks.inProgress);
    document.getElementById('awaitFeedbackCount').innerHTML = createListItems(tasks.awaitFeedback);
    document.getElementById('doneCount').innerHTML = createListItems(tasks.done);
}

// Aufruf der Funktion zum Laden und Darstellen der Aufgaben
displayTasks();

window.onload = function () {
    updateGreeting();
    setFutureDate();
    loadTasksFromLocalStorage();
};