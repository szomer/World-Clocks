
function loadClocks() {
  // set context and time type
  document.getElementById('clocks').innerHTML = contextHTML;
  document.getElementById('timeType').innerHTML = timeType;

  // DIGITAL TYPE
  if (timeType == 'Digital') {

    const interval = setInterval(function () {

      for (var x = 0; x < digIds.length; x++) {

        var date = new Date();
        var h = date.getHours(); // 0 - 23
        var m = date.getMinutes(); // 0 - 59
        var s = date.getSeconds(); // 0 - 59
        var session = "AM";

        h = (h + (times[x] - 1));

        if (h == 0) {
          h = 12;
        }

        if (h > 12) {
          h = h - 12;
          session = "PM";
        }

        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;

        var time = h + ":" + m + ":" + s + " " + session;


        document.getElementById(digIds[x]).innerText = time;
        document.getElementById(digIds[x]).textContent = time;


        var s = 'blockUtc' + x;
        document.getElementById(s).innerHTML = 'UTC ' + times[x];
      }

    }, 1000);

  }
  // ANALOG TYPE
  else {
    // arrays
    var canv = [];
    var rads = [];
    var ctxs = [];

    // initialize canvas and measurements for every time
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

        var s = 'blockUtc' + x;
        document.getElementById(s).innerHTML = 'UTC ' + times[x];

      }
    }, 1000);
  }
}

// analog
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
  drawHand(ctx, second, radius * 0.8, radius * 0.02, '#0de0dd');

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
// analog
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


function changeTimeType() {
  if (timeType == 'Digital') {
    document.getElementById('timeType').innerHTML = 'Analog';
    timeType = 'Analog';

  } else {
    document.getElementById('timeType').innerHTML = 'Digital'
    timeType = 'Digital'
  }
  generateHTML();
  loadClocks();
}