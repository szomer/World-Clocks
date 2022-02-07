var times = []; // Array of timezones
var cities = []; // Array of city names
var timeType; // Digital or Analog
var otherPage;
var contextHTML; // Store generated HTML content

// Array for ditial clock properties
var digIds = [];

// Arrays for analog clock properties
var canvasIds = [];
var canv = [];
var rads = [];
var ctxs = [];


// Retrieve settings from server
getSettings();

// Route the page on load
router();

// Router function will be called when popstate function called
// Called when back or forward buttons are used 
window.addEventListener('popstate', router);


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

// Route page
async function router() {
  let route = location.pathname;
  makeMenuChoiceActive(route);

  // transform route to be a path to a partial
  route = route === '/' ? '/home' : route;
  route = '/partials' + route + '.html';

  // load the content from the partial
  let content = await (await fetch(route)).text();

  // If no content found then load the start page
  content.includes('<title>Error</title>') && location.replace('/');

  // Replace the content of page
  document.querySelector('#contentWrapper').innerHTML = content;

  if (route == '/partials/home.html') {
    otherPage = false;
    loadClocks();

  } else if (route == '/partials/page1.html') {
    otherPage = true;

  } else if (route == '/partials/page2.html') {
    otherPage = true;
  }
}

// Display menu choice
function makeMenuChoiceActive(route) {
  // Change active link in the menu
  let aTagsInNav = document.querySelectorAll('nav a');

  for (let aTag of aTagsInNav) {
    aTag.classList.remove('active');
    let href = aTag.getAttribute('href');
    if (href === route) {
      aTag.classList.add('active');
    }
  }
}

// Generate html to be displayed
function generateHTML() {
  contextHTML = '';

  // Add each city to the HTML
  for (var i = 0; i < cities.length; i++) {

    // Set time for city
    getTimezone(cities[i], i);

    // Generate html for digital time
    if (timeType == 'Digital') {

      var dig = 'clockDigital' + i;
      digIds[i] = dig;

      contextHTML = contextHTML.concat('<div class="blockDigital"><h2 id ="blockTitle' + i + '">' + cities[i] + '</h2><h3 id="blockUtc' + i + '">UTC ' + times[i] + '</h3><div id="clockDigital' + i + '" class="clockDigital"></div></div>');
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

// Get settings from server
function getSettings() {
  // GET request
  $.ajax({
    type: 'GET', //type of request
    url: 'http://127.0.0.1:3000/settings', //url to server
    contentType: 'application/json', //content type

  }).done(function (result) {

  }).fail(function (xhr, status, error) {
    // Request error
    console.log(error);

  }).always(function (data) {
    cities = data.cities;
    timeType = data.type;

    console.log('cities ' + cities);
  });

  if (cities.length < 1) {
    setTimeout(() => { generateHTML(); loadClocks(); }, 500);
  }
}

// Set settings to server
function setSettings() {
  // POST request
  $.ajax({
    type: 'POST', //type of request
    url: 'http://127.0.0.1:3000/config', //url to server
    data: { city: ['Vancouver', 'New York'] }, //parameter
  }).done(function (result) {

  }).fail(function (xhr, status, error) {
    // Request error
    console.log(error);
  });
}

// Requesting data from server and display in table
function getTimezone(lookupString, i) {
  // GET request
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