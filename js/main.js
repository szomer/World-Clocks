var canvasIds = [];
var times = [];
var cities = [];
var timeType;

var contextHTML;

retrieveSettings();


// Router function will be called when popstate function called
// Called when back or forward buttons are used 
window.addEventListener('popstate', router);

// run on page load
router();


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

  if (route == '/partials/home.html') {
    // if the route is '/partials/page1.html' load the clocks
    loadClocks(timeType);
  } else if (route == '/partials.page1.html') {

  }
}

// display menu choice
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

function retrieveSettings() {
  cities.push('Vancouver');
  cities.push('Mexico City');
  cities.push('New York');
  cities.push('Brasilia');
  cities.push('Amsterdam');
  cities.push('Moscow');
  cities.push('New Delhi');
  cities.push('Hong Kong');
  cities.push('Tokyo');
  timeType = 'Analog';

  contextHTML = '';

  generateHTML();
}


function generateHTML() {

  contextHTML = '';

  // Add each city to the HTML
  for (var i = 0; i < cities.length; i++) {

    // Set time
    getTimezone(cities[i], i);

    // Generate html for digital time
    if (timeType == 'Digital') {
      contextHTML = contextHTML.concat('<p>sample</p>')


    }
    // Generate html for analog time
    else {
      // Set canvas
      var can = 'clockcanvas' + i;
      canvasIds[i] = can;

      contextHTML = contextHTML.concat('<div class="block"><h2 id ="blockTitle' + i + '">' + cities[i] + '</h2><h3 id="blockUtc' + i + '">UTC ' + times[i] + '</h3><canvas class="clockcanvas' + i + '"width="250" height="250"></canvas></div>')
    }
  }

  times.filter(n => n);
}

// Requesting data from server and display in table
function getTimezone(lookupString, i) {

  // GET Data Request
  $.ajax({
    type: 'GET', //type of request
    url: 'http://127.0.0.1:3000/timezone', //url to server
    contentType: 'application/json', //content type
    data: { city: lookupString }, //parameter

  }).done(function (result) {

  }).fail(function (xhr, status, error) {
    // Request error
    console.log(error);

  }).always(function (data) {
    // Response data from server
    var r = data.substr(0, 3);
    times[i] = parseInt(r);
  });
}