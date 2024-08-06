document.addEventListener('DOMContentLoaded', () => {
  let includesLoadedHandled = false;

  document.addEventListener('includesLoaded', handleIncludesLoaded);
  
  function handleIncludesLoaded() {
    if (!includesLoadedHandled) {
      includesLoadedHandled = true;
      handleUserProfile();
    }
  }

  function handleUserProfile() {
    let loggedInUserName = localStorage.getItem('loggedInUserName');
    if (loggedInUserName) {
      let initials = getInitials(loggedInUserName);
      updateInitialsElement(initials);
    } 
  }

  function getInitials(userName) {
    let nameParts = userName.split(' ');
    return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  }

  function updateInitialsElement(initials) {
    let initialsElement = document.getElementById('user-profile-initials');
    if (initialsElement) {
      initialsElement.innerHTML = `${initials}`;
      initialsElement.addEventListener('click', toggleLogOutVisibility);
    }
  }

  function toggleLogOutVisibility() {
    let logOutElement = document.getElementById('logOut');
    if (logOutElement) {
      logOutElement.classList.toggle('d-none');
    }
  }

  document.addEventListener('click', handleDocumentClick);

  function handleDocumentClick(event) {
    let logOutElement = document.getElementById('logOut');
    let initialsElement = document.getElementById('user-profile-initials');

    if (logOutElement && !logOutElement.contains(event.target) &&
        !initialsElement.contains(event.target) &&
        !event.target.closest('#logOut')) {
      logOutElement.classList.add('d-none');
    }
  }
});

function logout() {
  // Wert aus dem lokalen Speicher löschen
  localStorage.removeItem('loggedInUserName');
  
}

