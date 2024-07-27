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

window.onload = function () {
    updateGreeting();
    setFutureDate();
};