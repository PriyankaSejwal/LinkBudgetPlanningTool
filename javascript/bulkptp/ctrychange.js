// this javascript file has functions whihc will check any change in the country selection button

// $(document).ready(function () {
//   var tableWrapper = $("#datatable");
//   var tableFixedCol = $("#datatable td:first-child");

//   tableWrapper.scroll(function () {
//     var scrollLeft = tableWrapper.scrollLeft();
//     tableFixedCol.css("left", scrollLeft);
//   });
// });
var eirparray;
function countrychange() {
  // reset button now visible
  $("#importptp-container").removeClass("disable");
  $("#importptpresetLink").removeClass("disable");
  //   selected country
  var countrySelected = $("#importptpvtryCode option:selected").html();
  var countryCode = $("#importptpctryCode").val();
  console.log(countryCode);
  // Resetting the previously entered information if any link was planned.
  //  document.querySelector("#resetForm").reset();
  //  clearOverlays();
  //  if (ptppolyline != null) {
  //    ptppolyline.setMap(null);
  //  }
  // Clearing the calculation table and hiding the elevation
  //  var reset = document.querySelectorAll(".resetTable");
  //  for (var i in reset) {
  //    reset[i].innerHTML = "";
  //  }

  // IF CTRY IS NO COUNTRY
  if (countryCode == "nd") {
    importptpmap.setZoom(5);
  }

  eirparray = eirplimits(countryCode);
}

/* this function uses the country array which can be found in ctryArray.js 
uses the lat longs from country array[0:1] and centers map on these lat long values, 
and it returns the eirp ctrycodelat long bounds from the country array*/
function eirplimits(ctrycode) {
  var matchfound = false;
  for (var [key, val] of Object.entries(country_dict)) {
    if (key == ctrycode) {
      var valuesplit = val.split(",");
      console.log(valuesplit);
      var [latitude, longitude] = valuesplit.slice(0, 2);
      console.log(latitude, longitude);
      importptpmap.setCenter({
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      });
      // zooming ther map in
      importptpmap.setZoom(7);
      // returning the eirp for the four frequency ranges, then the code of the country, then the lat long bounds
      matchfound = true;
      return valuesplit.slice(2, 11);
    }
  }
}

// function which will return the value of eirp and max transmit power allowed
// two global variables whihc will be used in somewhere elese in the program too
var eirp, maxtx;
function geteirpmaxTx(frequency) {
  if (frequency <= 5250) {
    eirp = eirparray[0].split(":")[0];
    maxtx = eirparray[0].split(":")[1] > 27 ? 27 : eirparray[0].split(":")[1];
  } else if (frequency <= 5345) {
    eirp = eirparray[1].split(":")[0];
    maxtx = eirparray[1].split(":")[1] > 27 ? 27 : eirparray[0].split(":")[1];
  } else if (frequency <= 5720) {
    eirp = eirparray[2].split(":")[0];
    maxtx = eirparray[2].split(":")[1] > 27 ? 27 : eirparray[0].split(":")[1];
  } else {
    eirp = eirparray[3].split(":")[0];
    maxtx = eirparray[3].split(":")[1] > 27 ? 27 : eirparray[0].split(":")[1];
  }
  return [eirp, maxtx];
}

function calculateTxPower(frequency, antGain, cableloss, row) {
  var eirptxpower = geteirpmaxTx(frequency);
  var eirp = eirptxpower[0];
  var maxtx = eirptxpower[1];
  // calculated tx power
  var txpower = eirp - antGain + cableloss;
  // check the calculated tx with the maxtx allowed as per the country
  var tx = txpower > maxtx ? maxtx : txpower;
  return [tx, eirp];
}

// resetting the form and the page when rest button is clicked
$("#importptpresetLink").click(function () {
  // window.alert("read");
  $("#resetimportptpForm").trigger("reset");
  // hide all messages
  $("#forcoordcheck").html("");
  $("#forradiocheck").html("");
  $("#forgaincheck").html("");
  $("#allokmessage").html("");
  // remove markers and polylines
  var markerarraylength = markerarray.length;
  for (let i = 0; i < markerarraylength; i++) {
    markerarray[i].setMap(null);
  }
  var polylinearraylength = polylinearray.length;
  for (let i = 0; i < polylinearraylength; i++) {
    polylinearray[i].setMap(null);
  }

  markerarray.length = 0;
  polylinearray.length = 0;

  // disbale the report button
  $("#importptpreportbtn").prop("disabled", true);

  // empty the report table
  $("#datatable tr:not(:first)").remove();

  // zoom in the map
  // zooming ther map in
  importptpmap.setZoom(7);
});
