# Lab 2 - World Clocks

Software Development for the Web

25 January 2022

Single Page Application served by a webserver on [**Node.js**](https://nodejs.org/en/) with the use of [**Express**](https://expressjs.com/). The font-end uses the JavaScript library [**jQuery**](https://jquery.com/). The back-end uses npm modules for retrieving [**City or Country names**](https://www.npmjs.com/package/countries-and-timezones) and [**Timezones**](https://www.npmjs.com/package/city-timezones).

---

## Screenshots of the App

![Alt text](img/clocks1.JPG?raw=true "Home page - Analog")
_The Home Page with Analog Clocks_

---

![Alt text](img/clocks2.JPG?raw=true "Home page - Digital")
_The Home Page with Digial Clocks_

---

![Alt text](img/settings1.JPG?raw=true "Settings page")
_The Settings Page_

---

![Alt text](img/about.JPG?raw=true "About page")
_The About Page_

---

## Running the website

1. Navigate with cmd/terminal to the server folder and start the server `node server.js`
2. Open the webbrowser and browe to `localhost:3000`. Replace `3000` if another port is specified.

---

## Project Requirements

### Grade 3

- [x] Create sketches of how you want the site to look graphically, not only wireframes but also the choice of color, font, layout in general should appear from the sketches. Add the sketches or links to them in you repository
- [x] Create a SPA (Single Page Application)-site with where you can keep track of local time in different cities around the world.
- [x] The user should both be able to choose from a list of 20 major cities in the world.
- [x] It should be possible to display clocks / times both digitally and analogously (ie with a traditional clock with hands).
- [x] You must version handle your code with Git - create an open repository on GitHub. It will be the link to the repository your teacher uses when grading.

### Grade 4

- [x] The user should be able add their own cities + time zones for the cities.
- [x] The site should save settings (which cities and their time zones users have selected) in localStorage. These should then be loaded the next time the user visits the site. (Feel free to use Thomas’ upcoming example of how to use localStorage in a simple way as a basis for your code.)

### Grade 5

- [x] Includes names and time zones for at least 50 major world cities from a json file or from an open API for this (if you can find one).
- [x] The site must be responsive - ie. work and look good on different screen sizes (from mobile to larger computer screens).
- [x] Continuous commits should have been made to git with good titles and/or desriptions of each commit.
