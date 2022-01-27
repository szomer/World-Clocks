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


// Modules
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

// Portnumber
// portnumber set in CMD -> set PORT=5000
// If no portnumber set -> use PORT=3000
const port = process.env.PORT || 3000;

// Listen to port
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);  //Show on console
});

// ACCESSING http://localhost:3000/                         
app.get('/', (req, res) => { //GET localhost:3000/
  fs.readFile(__dirname + "/serverpage.html") //Load the HTML file
    .then(contents => {
      res.setHeader("Content-Type", "text/html"); //Set content type
      res.writeHead(200); //Status code 200
      res.end(contents);  //Send the HTML to client
    })
    .catch(err => { //In case of error
      res.writeHead(500); //Status code 500
      res.end(err);  //Send
      return;
    });
});

// RETRIEVING A SPECIFIC TIMEZONE
app.get('/timezone', (req, res) => {
  // loop up the city that matches the string sent by the client
  var lookupCity = cityTimezones.lookupViaCity(req.query.city)

  // look up the time zone related to the found city name
  const timezone = ct.getTimezone(lookupCity[0].timezone);

  // send the timezone string to to the client
  res.send(timezone.utcOffsetStr);
});