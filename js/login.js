const BASE_URL = "https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/";

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.logIn').addEventListener('click', function(event) {
        event.preventDefault();  // Prevent form submission
        const email = document.getElementById('email').value;
        const password = document.getElementById('repeatPassword').value;

        // Check if the email exists in the Firebase Realtime Database
        fetch(`${BASE_URL}/registerInfo.json`)
            .then(response => response.json())
            .then(data => {
                if (data && data.email) {
                    const emailIndex = data.email.indexOf(email);
                    if (emailIndex === -1) {
                        alert('Email does not exist.');
                    } else {
                        // Email exists, proceed with login
                        if (data.password[emailIndex] === password) {
                            alert('Successfully logged in.');
                            // Redirect to another page or perform other actions
                        } else {
                            alert('Incorrect password.');
                        }
                    }
                } else {
                    alert('No users found in the database.');
                }
            })
            .catch(error => {
                // Handle errors in checking email
                alert(`Error: ${error.message}`);
            });
    });

    document.querySelector('.guestLogIn').addEventListener('click', function(event) {
        event.preventDefault();  // Prevent form submission
        alert('Guest login not implemented.');
    });
});