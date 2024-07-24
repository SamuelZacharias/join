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