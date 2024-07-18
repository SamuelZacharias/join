const BASE_URL = "https://join-40dd0-default-rtdb.europe-west1.firebasedatabase.app/";

document.addEventListener('DOMContentLoaded', function() {
    // Event listener for the login button
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

    // Event listener for the "Remember me" checkbox
    const rememberMeCheckbox = document.querySelector('.check input[type="checkbox"]');
    rememberMeCheckbox.addEventListener('change', function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('repeatPassword').value;

        if (this.checked) {
            // Store email and password in local storage
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        } else {
            // You can choose not to remove items from local storage here
            // localStorage.removeItem('rememberedEmail');
            // localStorage.removeItem('rememberedPassword');
        }
    });

    // Check local storage on page load and fill email and password if remembered
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail && rememberedPassword) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('repeatPassword').value = rememberedPassword;
        rememberMeCheckbox.checked = true; // Check the checkbox if email and password are remembered
    }

    // Event listener for the guest login button
    document.querySelector('.guestLogIn').addEventListener('click', function(event) {
        event.preventDefault();  // Prevent form submission
        alert('Guest login not implemented.');
    });
});