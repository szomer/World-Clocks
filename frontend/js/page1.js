// Load settings contents
function loadSettings() {
  populateTable();
}

// Add the cities and their timezone to the table
function populateTable() {
  var table = document.getElementById("settingsTable");

  for (var i = 0; i < cities.length; i++) {
    // Create new row and cells
    var row = table.insertRow(i + 1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    // Add values to cells
    cell1.innerHTML = i;
    cell2.innerHTML = cities[i];
    cell3.innerHTML = times[i];
  }
}

// Update new settings on server
function setSettings() {
  var arr = ['Vancouver', 'New York', 'Tokyo'];
  var newTime = 'Analog';

  // GET request
  $.ajax({
    type: 'GET', //type of request
    url: '/api/config', //url to server
    data: {
      data1: (arr),
      data2: newTime
    },
    // convert array to string
  }).done(function (result) {
    console.log(result);

  }).fail(function (xhr, status, error) {
    // Request error
    console.log(error);
  });
}