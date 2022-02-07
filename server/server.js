// NODEJS--------------------------------------------------
// Running this script from CMD:
// set PORT=5000 -> optional
// node index.js -> nodemon for updating changes automatically

// EXPRESS-SET-UP------------------------------------------
// STEP 1 -> CMD in the dir of project:
// npm init --yes
// npm install express

// STEP 2 -> require express in the code:
// const express = require('express');
// const app = express();

// INSTALLATIONS--------------------------------------------
// npm install --save countries-and-timezones
// npm install cors
// ---------------------------------------------------------


// MODULES
// Used for req, URL paths, set web app settings
const express = require('express');
// Used to load the HTML file [readFile()]
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const ct = require('countries-and-timezones');
const cityTimezones = require('city-timezones');


// Create the web app with express
const app = express();

app.use(cors());
app.use(bodyParser.json());


// Portnumber set in CMD -> set PORT=5000
// If no portnumber set -> use PORT=3000
const port = process.env.PORT || 3000;

// Serve all files in the frontend folder
app.use(express.static('../frontend'));

// Start the webserver
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);  //Show on console
});


// RETRIEVING A SPECIFIC TIMEZONE
app.get('/timezone', (req, res) => {
  try {
    // loop up the city that matches the string sent by the client
    var lookupCity = cityTimezones.lookupViaCity(req.query.city)

    // look up the time zone related to the found city name
    const timezone = ct.getTimezone(lookupCity[0].timezone);

    // send the timezone string to to the client
    res.send(timezone.utcOffsetStr);

  } catch (err) { // In case of error
    res.writeHead(500);
    res.end(err);
    return;
  }
});

// CHANGING SETTINGS FILE
app.post('/config', (req, res) => {
  var newCities = [];

  var qs = require('querystring');
  if (req.method == 'POST') {
    var body = '';

    req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6)
        req.connection.destroy();
    });

    req.on('end', function () {
      var post = qs.parse(body);
      console.log(post.city);
    });
  }
  // send the timezone string to to the client
  res.send("received");
});

// RETRIEVING SETTINGS
app.get('/settings', (req, res) => {
  const fs = require("fs");
  fs.readFile("./settings.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      const config = JSON.parse(jsonString);
      console.log(config);
      res.send(config);

    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
});