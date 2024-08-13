/**
 * Asynchronously loads HTML content into elements with the `w3-include-html` attribute.
 * 
 * This function searches for all elements with the `w3-include-html` attribute, 
 * fetches the HTML file specified in the attribute's value, and inserts the content 
 * into the element. After the content is loaded, the `w3-include-html` attribute 
 * is removed from the element. If the content fails to load, an error message is 
 * displayed in the element.
 * 
 * Once all includes have been loaded, a custom event `includesLoaded` is dispatched.
 * 
 * @async
 * @returns {Promise<void>} A promise that resolves once all HTML content has been loaded.
 */
async function includeHTML() {
    const elements = document.querySelectorAll('[w3-include-html]');
    const promises = [];
  
    for (const element of elements) {
        const file = element.getAttribute('w3-include-html');
        if (file) {
            const promise = fetch(file)
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
    }
    await Promise.all(promises);
    document.dispatchEvent(new CustomEvent('includesLoaded'));
  }
  
  /**
   * Event listener that triggers the `includeHTML` function when the DOM content is fully loaded.
   */
  document.addEventListener('DOMContentLoaded', includeHTML);
  
  /**
   * Event listener that makes the body visible once all HTML includes have been loaded.
   * This listener waits for the custom `includesLoaded` event dispatched by the `includeHTML` function.
   */
  document.addEventListener('includesLoaded', () => {
    document.body.style.visibility = 'visible';
  });
  