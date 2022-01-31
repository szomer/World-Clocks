function loadClocks() {
  // add canvases to html
  document.getElementById('clocks').innerHTML = contextHTML;

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