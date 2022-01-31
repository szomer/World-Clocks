var canvasIds = [];
var times = [];


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
  // route === '/partials/page1.html';

  // if we are on the home page, draw the clocks
  if (route == '/partials/home.html') {
    console.log('loading clocks');


    canvasIds = ["clockcanvas0", "clockcanvas1", "clockcanvas2", "clockcanvas3", "clockcanvas4"];
    times = [-2, -1, 0, 1, 2];
    var canv = [];
    var rads = [];
    var ctxs = [];


    // initialize canvas and measurements
    for (var x = 0; x < canvasIds.length; x++) {
      var c = document.getElementsByClassName(canvasIds[x]);
      var canvas = c[0];

      var ctx = canvas.getContext("2d");
      var radius = canvas.height / 2;
      ctx.translate(radius, radius);
      radius = radius * 0.90

      // store
      canv[x] = canvas;
      ctxs[x] = ctx;
      rads[x] = radius
    }

    // every second draw clocks
    const interval = setInterval(function () {
      for (var x = 0; x < canvasIds.length; x++) {

        // Store the current transformation matrix
        ctxs[x].save();
        // Use the identity matrix while clearing the canvas
        ctxs[x].setTransform(1, 0, 0, 1, 0, 0);
        ctxs[x].clearRect(0, 0, canv[x].width, canv[x].height);
        // Restore the transform
        ctxs[x].restore();

        // Call drawing canvas methods
        drawTime(ctxs[x], rads[x], times[x]);
      }
    }, 1000);
  }
}

function drawTime(ctx, radius, timeOffset) {
  // get current browser time
  var now = new Date();
  // get utc time
  now.toUTCString;

  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();


  // second
  second = (second * Math.PI / 30);
  drawHand(ctx, second, radius * 0.9, radius * 0.02, '#0de0dd');

  //minute
  minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
  drawHand(ctx, minute, radius * 0.7, radius * 0.04, '#FFFFFF');

  //hour
  hour = hour % 12;
  hour = (hour * Math.PI / 6) +
    (minute * Math.PI / (6 * 60)) +
    (second * Math.PI / (360 * 60));
  hour = (hour + (timeOffset / 2));
  drawHand(ctx, hour, radius * 0.4, radius * 0.05, '#FFFFFF');
}

function drawHand(ctx, pos, length, width, color) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.rotate(-pos);
}

function drawNumbers(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius * 0.15 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for (num = 1; num < 13; num++) {
    ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.85);
    ctx.rotate(-ang);
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



// Router function will be called when popstate function called
// Called when back or forward buttons are used 
window.addEventListener('popstate', router);

// run on page load
router();