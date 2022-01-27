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

  // do nothing if not click on an atag
  if (!aTag) { return; }

  let href = aTag.getAttribute('href');

  // check if external link then open in a new window
  if (href.indexOf('http') === 0) {
    aTag.setAttribute('target', '_blank');
    return;
  }

  // it's an internal link
  // prevent the default behavior of the browser
  // (that is - follow the link/reload the page)
  event.preventDefault();

  // Use HTML5 history and push a new state
  history.pushState(null, null, href);

  // Call the router
  router();
});

async function router() {
  let route = location.pathname;
  makeMenuChoiceActive(route);

  // transform route to be a path to a partial
  route = route === '/' ? '/home' : route;
  route = '/partials' + route + '.html';

  // load the content from the partial
  let content = await (await fetch(route)).text();

  // if no content found then load the start page
  content.includes('<title>Error</title>') && location.replace('/index.html');

  // replace the content of the main element
  document.querySelector('#contentWrapper').innerHTML = content;

  // run the productLister function (in another file)
  // if the route is '/partials/page1.html';
  route === '/partials/page1.html' && getTimezone();
}

function makeMenuChoiceActive(route) {
  // change active link in the menu
  let aTagsInNav = document.querySelectorAll('nav a');

  for (let aTag of aTagsInNav) {
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