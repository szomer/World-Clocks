// event handling
// listens to clicks made on body
// only react if clicked on an 'a' tag
document.querySelector('body').addEventListener('click', function (event) {

  // event = an object with info about the event
  // event.target = the innermost HTML-element I clicked
  // closest - a method all HTML-element have
  // that you can send a selector to to see if it matches
  // the element or any of its parents

  let aTag = event.target.closest('a');

  // Return if not body click
  if (!aTag) { return; }

  let href = aTag.getAttribute('href');
  // Check if external link, then open in a new window
  if (href.indexOf('http') == 0) {
    aTag.setAttribute('target', '_blank');
    return;
  }

  // Prevent the deault behavior of the browser
  // Internal link
  event.preventDefault();

  // Use HTML5 history for the pages and push new state
  history.pushState(null, null, href);

  // Call the router function
  router();
});


async function router() {
  let route = location.pathname;
  makeMenuChoiceActive(route);
  console.log(route);

  // transform route to be a path to a partial
  route = route === '/' ? '/home' : route;
  route = '/partials' + route + '.html';
  console.log(route);

  // load content from the partial
  let content = await (await fetch(route)).text();

  // if no content found, load the start page
  content.includes('<title>Error</title>') && location.replace('/');

  // replace the content of the main element
  document.querySelector('#contentWrapper').innerHTML = content;

  // route === '/partials/page2.html' && loadEmployees();
}

function makeMenuChoiceActive(route) {
  let aTagInNav = document.querySelectorAll('nav a');
  for (let aTag of aTagInNav) {
    aTag.classList.remove('active');
    let href = aTag.getAttribute('href');
    if (href === route) {
      aTag.classList.add('active');
    }
  }
}


// Router function will be called when popstate function called
// Called when back or forward buttons are used 
window.addEventListener('popstate', router);

// run on page load
router();