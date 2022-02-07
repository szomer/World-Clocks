// Create and load the clocks
function loadClocks() {
  // Set HTML context and time type analog/digital
  document.getElementById('clocks').innerHTML = contextHTML;
  document.getElementById('timeType').innerHTML = timeType;

  // DIGITAL TYPE
  if (timeType == 'Digital') {

    // Every second draw clocks
    const intervalDigital = setInterval(function () {

      // Stop refreshing
      if ((timeType == 'Analog') || (otherPage)) {
        clearInterval(intervalDigital);
        return;
      }

      // Loop through all digital clocks
      for (var x = 0; x < digIds.length; x++) {

        // Set base time
        var date = new Date();
        var h = date.getHours(); // 0 - 23
        var m = date.getMinutes(); // 0 - 59
        var s = date.getSeconds(); // 0 - 59
        var session = "AM";

        // Change hour based on timezone
        h = (h + (times[x] - 1));

        // Set correct hour representation
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

        // Display time in html clock
        document.getElementById(digIds[x]).innerText = time;
        document.getElementById(digIds[x]).textContent = time;

        // Display timezone in html
        var s = 'blockUtc' + x;
        document.getElementById(s).innerHTML = 'UTC ' + times[x];
      }
    }, 1000);
  }
  // ANALOG TYPE
  else {

    // Initialize canvas and measurements for every time
    for (var x = 0; x < canvasIds.length; x++) {
      var c = document.getElementsByClassName(canvasIds[x]);
      var canvas = c[0];

      var ctx = canvas.getContext("2d");
      var radius = canvas.height / 2;
      ctx.translate(radius, radius);
      radius = radius * 0.90

      // Store values
      canv[x] = canvas;
      ctxs[x] = ctx;
      rads[x] = radius
    }

    // Every second draw clocks
    const intervalAnalog = setInterval(function () {

      // Stop refreshing
      if ((timeType == 'Digital') || (otherPage)) {
        console.log('stop analog')
        clearInterval(intervalAnalog);
        return;
      }

      // Loop through canvases
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

        // Display timezone in html
        var s = 'blockUtc' + x;
        document.getElementById(s).innerHTML = 'UTC ' + times[x];
      }
    }, 1000);
  }
}

// Analog drawing
function drawTime(ctx, radius, timeOffset) {
  // Get current browser time
  var now = new Date();
  now.toUTCString;
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();

  // Calculste seconds
  second = (second * Math.PI / 30);
  // Draw seconds
  drawHand(ctx, second, radius * 0.8, radius * 0.02, '#0de0dd');

  // Calculate minutes
  minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
  // Draw minutes
  drawHand(ctx, minute, radius * 0.7, radius * 0.04, '#FFFFFF');

  // Calculate hours
  hour = hour % 12;
  hour = (hour * Math.PI / 6) +
    (minute * Math.PI / (6 * 60)) +
    (second * Math.PI / (360 * 60));
  // Change hour based on timezone
  hour = (hour + (timeOffset / 2));
  // Draw hours
  drawHand(ctx, hour, radius * 0.4, radius * 0.05, '#FFFFFF');
}
// Analog drawing
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

// Change the time type analog/digital
function changeTimeType() {

  if (timeType == 'Digital') {
    document.getElementById('timeType').innerHTML = 'Analog';
    timeType = 'Analog';
  } else {
    document.getElementById('timeType').innerHTML = 'Digital'
    timeType = 'Digital'
  }

  // Generate HTML for clocks
  generateHTML();
  // Load the clocks
  loadClocks();
}