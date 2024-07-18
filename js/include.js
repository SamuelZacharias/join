function includeHTML() {
  var elements = document.querySelectorAll('[w3-include-html]');
  var promises = [];

  elements.forEach(function(element) {
    var file = element.getAttribute('w3-include-html');
    if (file) {
      var promise = fetch(file)
        .then(response => {
          if (!response.ok) throw new Error(`Failed to load ${file}: ${response.statusText}`);
          return response.text();
        })
        .then(text => {
          element.innerHTML = text;
          element.removeAttribute('w3-include-html');
        })
        .catch(error => {
          console.error(`Error loading ${file}:`, error);
          element.innerHTML = 'Error loading content.';
        });

      promises.push(promise);
    }
  });

  Promise.all(promises).then(() => {
    console.log('All includes loaded.');
  });
}

// Call the function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', includeHTML);