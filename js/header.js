document.addEventListener('DOMContentLoaded', async () => {
  // Await the DOM content loaded
  await new Promise(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });

  let loggedInUserName = localStorage.getItem('loggedInUserName');
  
  if (loggedInUserName) {
      console.log('Logged-in user name:', loggedInUserName);
      let nameParts = loggedInUserName.split(' ');
      let initials = nameParts.map(part => part.charAt(0).toUpperCase()).join(' ');
      let initialsElement = document.getElementById('user-profile-initials');
      if (initialsElement) {
          initialsElement.innerHTML = `${initials}`;
      }

      console.log(initials);
  } else {
      console.log('No logged-in user name found');
  }
});