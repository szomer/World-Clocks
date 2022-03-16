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
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const ct = require('countries-and-timezones');
const cityTimezones = require('city-timezones');
const { off, send } = require('process');


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
app.get('/api/timezone', (req, res) => {

  try {
    var c = req.query.city; //Amsterdam0
    var len = c.length - 1; //9
    var c1 = c.substring(0, len); //Amsterdam
    var c2 = c.substring(len, len + 1); //0

    // Loop up the city that matches the string sent by the client
    var lookupCity = cityTimezones.lookupViaCity(c1);

    // Look up the time zone related to the found city name
    const timezone = ct.getTimezone(lookupCity[c2].timezone);

    // Send the timezone string to to the client
    res.send(timezone.utcOffsetStr);

  } catch (err) { // In case of error
    res.writeHead(500);
    res.end(err);
    return;
  }
});

// CHECK FOR CITY
app.get('/api/city', (req, res) => {
  try {
    // Loop up the city that matches the string sent by the client
    var lookupCity = cityTimezones.lookupViaCity(req.query.city);

    resultHTML = "";

    if (lookupCity.length > 0) {
      for (var i = 0; i < lookupCity.length; i++) {

        // Look up the time zone related to the found city name
        const timezone = ct.getTimezone(lookupCity[i].timezone);

        var d1 = lookupCity[i].city;
        var d2 = lookupCity[i].country;
        var d3 = timezone.utcOffsetStr;
        d3 = parseInt((d3.substr(0, 3)));

        resultHTML = resultHTML.concat('<div class="resultItemList" onclick="addCity(' + i + ')">' + d1 + ', ' + d2 + ', ' + d3 + ' UTC </div>');
      }
    }
    // Send result to client
    res.send(resultHTML);

  } catch (err) { // In case of error
    res.writeHead(500);
    res.end(err);
    return;
  }
});

// RETRIEVING SETTINGS
app.get('/api/settings', (req, res) => {
  fs.readFile("./settings.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      const config = JSON.parse(jsonString);
      res.send(config);

    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
});

// ADD A CITY TO SETTINGS
app.get('/api/addcity', (req, res) => {

  // New city name and arr location
  var newCity = req.query.city;
  var arrOffset = req.query.id;

  // Split the offset from the name
  var lookupCity = cityTimezones.lookupViaCity(newCity);
  var d1 = lookupCity[arrOffset].city;
  d1 = d1.concat(arrOffset);

  var t;
  var arr = [];

  // Append d1 to json
  var fs = require('fs');
  fs.readFile("./settings.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      // Retrieve settings file variables
      const config = JSON.parse(jsonString);
      t = config.type;
      arr = config.cities;

      // Add new city to array
      arr.push(d1);
      // Check if type is defined
      if (t == null) { t = "Analog"; }

      // Remove duplicates
      cities = arr.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      });

      // Transform into json
      var obj = { type: t, cities }
      var json = JSON.stringify(obj);

      // Write to file
      var fs = require('fs');
      fs.writeFile('./settings.json', json, function (error) {

      });

    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
});

// ADD TIMEZONE TO SETTINGS
app.get('/api/addtimezone', (req, res) => {
  var t = req.query.time;

  var fs = require('fs');
  fs.readFile("./settings.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {

      // Retrieve settings file variables
      const config = JSON.parse(jsonString);
      arr = config.cities;

      // Remove duplicates
      cities = arr.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      });

      // Transform into json
      var obj = { type: t, cities }
      var json = JSON.stringify(obj);

      // Write to file
      var fs = require('fs');
      fs.writeFile('./settings.json', json, function (error) {
      });

    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
});

app.get('/api/currenttimezone', (req, res) => {
  var fs = require('fs');
  fs.readFile("./settings.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      // send timezone
      const config = JSON.parse(jsonString);
      var t = config.type;
      res.send(t);

    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
});

app.all('/partials/*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '../frontend', 'partials', '404.html'));
});

app.all('*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});