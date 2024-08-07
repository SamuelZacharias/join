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

function includeHTML(callback) {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain attribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML(callback);
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
  if (callback) callback();
}

function hideElements() {
  if (!localStorage.getItem('loggedInUserName')) {
    var styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = `
          .icon-bar { display: none !important; }
          #user-profile-initials { display: none !important; }
      `;
    document.head.appendChild(styleSheet);
  }
}

/* Initial call to load the sidebar and header, then possibly hide the elements */
includeHTML(hideElements);