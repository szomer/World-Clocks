// Requesting data from server and display in table
function getTimezone() {

  var timezoneText = document.getElementById("timezoneText");
  var lookupString = 'Los Angeles';

  console.log("data method");

  // GET Data Request
  $.ajax({
    type: 'GET', //type of request
    url: 'http://127.0.0.1:3000/timezone', //url to server
    contentType: 'application/json', //content type
    data: { city: lookupString }, //parameter
  }).done(function (result) {
    console.log(result);
  })
    .fail(function (xhr, status, error) {
      // Request error
      console.log(error);
    })
    .always(function (data) {
      // Display the result on page
      timezoneText.innerHTML = data;
    });
}