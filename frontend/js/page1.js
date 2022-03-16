var ispaused = false;

// Load settings contents
function loadSettings() {
  populateTable();
  setSwitch();

  // Remove search results if search bar empty
  const intervalSearch = setInterval(function () {
    if (!(location.pathname == '/page1'))
      clearInterval(intervalSearch);
    if ((document.getElementById('searchString').value == "") && (ispaused == false))
      document.getElementById("searchResults").innerHTML = " ";
  }, 500);
}

// Add the cities and their timezone to the table
function populateTable() {
  var table = document.getElementById("settingsTable");

  // Clear table
  for (var i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
  }

  // If timezones are not defined get settings froms server
  if (times.length == 0) {
    for (var i = 0; i < cities.length; i++) {
      getTimezone(cities[i], i);
    }
  }

  setTimeout(() => {
    // Populate table
    for (var j = 0; j < cities.length; j++) {
      // Create new row and cells
      var row = table.insertRow(j + 1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);

      var temp = cities[j];
      var len = temp.length - 1;
      var c1 = temp.substring(0, len);

      // Add values to cells
      cell1.innerHTML = j;
      cell2.innerHTML = c1;
      cell3.innerHTML = times[j] + " UTC";
    }
  }, 500);
}

// Set the switch to the correct option
function setSwitch() {
  $(document).ready(function () {
    if (preSetTimeType == 'Digital') {
      $(':checkbox').each(function () { this.checked = !this.checked; });
    }
  });
}

// Handle the search request for city
function handleSearch() {
  ispaused = false;
  var searchString = document.getElementById('searchString').value;
  var resultDiv = document.getElementById('searchResults');

  // GET request
  $.ajax({
    type: 'GET', //type of request
    url: '/api/city', //url to server
    contentType: 'application/json', //content type
    data: { city: searchString }, //parameter

  }).done(function (result) {

  }).fail(function (xhr, status, error) {
    // Request error
    console.log(error);

  }).always(function (data) {
    resultDiv.innerHTML = data;
  });
}

// Add city to settings
function addCity(cityId) {
  var cityName = document.getElementById('searchString').value;
  document.getElementById('searchString').value = "";

  // GET request
  $.ajax({
    type: 'GET', //type of request
    url: '/api/addcity', //url to server
    contentType: 'application/json', //content type
    data: { city: cityName, id: cityId }, //parameter

  }).done(function (result) {

  }).fail(function (xhr, status, error) {
    // Request error
    console.log(error);
  }).always(function (data) {
  });

  ispaused = true;
  // Display confirm message
  document.getElementById("searchResults").innerHTML = '<div id="confirmation"> Adding ' + cityName + ' to your cities...</div>';

  // Update table
  getSettings();
  for (var i = 0; i < cities.length; i++) {
    getTimezone(cities[i], i);
  }

  setTimeout(() => {location.reload(true); },1000);
}


// Handle switch state changes
function handleSwitch() {
  if ($('#toggle').is(":checked")) {
    if (timeType == 'Analog') {
      addTimeZone('Digital');
      timeType = 'Digital';
    }
  } else {
    if (timeType == 'Digital') {
      addTimeZone('Analog');
      timeType = 'Analog';
    }
  }
  setTimeout(() => { getSettings(); }, 500);
}

// Add timezone to settings
function addTimeZone(zone) {
  // GET request
  $.ajax({
    type: 'GET', //type of request
    url: '/api/addtimezone', //url to server
    contentType: 'application/json', //content type
    data: { time: zone }, //parameter
  }).done(function (result) {
  }).fail(function (xhr, status, error) {
    // Request error
    console.log(error);
  }).always(function (data) {
  });
}