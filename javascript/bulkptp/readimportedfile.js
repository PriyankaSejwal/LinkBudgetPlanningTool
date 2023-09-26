// this javascript file contains the functions whihc read the excel/csv file and perfomr the calculations required
// document.addEventListener("contextmenu", (event) => {
//   event.preventDefault();
// });
var polylinearray = [];
var markerarray = [];
$("#csvFile").change(function (event) {
  // hide the message section
  $(`.import-message-section`).hide();
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var contents = e.target.result;
    var workbook = XLSX.read(contents, { type: "binary" });
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
    // define expected headers
    var expectedHeaders = [
      "Serial Number",
      "Latitude Near End",
      "Longitude Near End",
      "Latitude Far End",
      "Longitude Far End",
      "Channel Bandwidth",
      "Channel Frequency",
      "Radio Near End",
      "Radio Far End",
      "Gain Near End",
      "Gain Far End",
      "Height Near End",
      "Height Far End",
    ];
    // check if expectedHeaders are same as headers in the excel file
    if (validateHeaders(data[0], expectedHeaders)) {
      displayData(data.slice(1)); // exclude Header row
    } else {
      console.log("Invalid Headers");
    }
  };
  reader.readAsBinaryString(file);
});

// function to validate headers
// function to validate headers
function validateHeaders(headers, expectedHeaders) {
  if (headers.length !== expectedHeaders.length) {
    $(`.import-message-section`).show();
    $(`#messageafterfileread`).html(
      `Expected ${expectedHeaders.length} columns but there are ${headers.length} columns in the uploaded file.`
    );
    return false;
  }
  for (var i = 0; i < headers.length; i++) {
    if (headers[i] !== expectedHeaders[i]) {
      $(`.import-message-section`).show();
      $(`#messageafterfileread`).html(
        "Header Names are different than expected in the uploaded file."
      );
      return false;
    }
  }
  return true;
}

// Display csv function
function displayData(data) {
  var unitarray = [
    "",
    "",
    "",
    "",
    "",
    " MHz",
    " MHz",
    "",
    "",
    " dBi",
    " dBi",
    " m",
    " m",
  ];
  var table = document.getElementById("datatable");
  $("#datatable tr:not(:first)").remove();
  // setting match to false
  var match = true;
  for (var i = 0; i < data.length; i++) {
    // var start = Date.now();
    // createnewcontainers(i);
    // console.log(Date.now() - start);

    var rowData = data[i];
    var row = table.insertRow(-1);
    // var numOfCells = $("#datatable th").length;
    // for(let j=0; j<numOfCells; j++){
    //   row.insertCell(j)
    // }
    for (let j = 0; j < rowData.length; j++) {
      if (rowData[j] != "") {
        cell = row.insertCell(j);
        cell.innerHTML = rowData[j] + unitarray[j];
      } else {
        window.alert(
          `The ${j}-th entry in row ${i} is empty. Kindly check that none of the cells are empty.`
        );
        break;
      }
    }

    // values of lat, long
    var lat1 = rowData[1];
    var long1 = rowData[2];
    var lat2 = rowData[3];
    var long2 = rowData[4];

    var latlongArray = [
      [lat1, long1],
      [lat2, long2],
    ];
    console.log(latlongArray);

    // function to check whether the radio A and B are same or not
    var radioA = rowData[7];
    var radioB = rowData[8];
    if (!checkRadio(radioA, radioB, i)) {
      match = false;
      $("#forcoordcheck").html(``);
      break;
    }

    // function to check the non-zero value of antenna gains
    var antgainA = rowData[9];
    var antgainB = rowData[10];
    if (!checkantgainvalue(antgainA, antgainB, i)) {
      match = false;
      $("#forcoordcheck").html(``);
      // $(`#forradiocheck`).html(`Radios belong to different families at row ${i}`)
      break;
    }

    // function to check the coordinate format
    if (!checkCoordinateFormat(latlongArray, rowData, row, i)) {
      match = false;
      $("#forcoordcheck").html(``);
      break;
    }

    if (match) {
      $("#forcoordcheck").html(
        "The coordinates are in proper format, radios are also from same families and antenna gains are non-zero positive values."
      );
      $(".import-message-section").show();
      $(`#importptpreportbtn`).prop("disabled", false);
    }

    //function which will change the color of the polyline connecting the two sites
    setColorPolyline(i);

    // function to place markers on the map for each pair of lat long
    // placeMarkerOnMap(l);

    //   function which calculates the hopdistsnce and azimuth
    // calculateHopDistanceAzimuth(lat1, long1, lat2, long2, rowData, row);

    // if ((i == data.length)) {

    //   $(`#forcoordcheck`).html("Co-ordinates are in proper format");
    //   $(`.import-message-section`).show();
    // }
  }
}

// $(`#importptpreportbtn`).click(function () {
//   placeMarkerOnMap();
// });

// function to place marker on map

function placeMarkerOnMap(decimalcoordArray, rowData, row, i) {
  var lat1 = decimalcoordArray[0][0];
  var long1 = decimalcoordArray[0][1];
  var lat2 = decimalcoordArray[1][0];
  var long2 = decimalcoordArray[1][1];
  console.log(lat1, long1, lat2, long2);
  var marker1 = new google.maps.Marker({
    map: importptpmap,
    position: { lat: parseFloat(lat1), lng: parseFloat(long1) },
    icon: "images/Site A.png",
  });

  var marker2 = new google.maps.Marker({
    map: importptpmap,
    position: { lat: parseFloat(lat2), lng: parseFloat(long2) },
    icon: "images/Site B.png",
  });
  bounds.extend(marker1.getPosition());
  bounds.extend(marker2.getPosition());
  importptpmap.fitBounds(bounds);

  markerarray.push(marker1, marker2);
  /*info window which will be attached to the markers to make user understand 
  that thiese markers belong to which site number*/

  var infoWindow = new google.maps.InfoWindow({
    content: `Site ${i + 1}`,
    // content: `<div style="color:polylinecolor">Site${i + 1}</div>`,
  });

  // show the infowindow by defualt al the time
  infoWindow.open(importptpmap, marker1);

  // show the infowindow by defualt al the time
  infoWindow.open(importptpmap, marker1);

  var polyline = new google.maps.Polyline({
    map: importptpmap,
    path: [marker1.getPosition(), marker2.getPosition()],
    strokeOpacity: 0.8,
  });
  polylinearray.push(polyline);

  // hopdistance
  calculateHopDistanceAzimuth(lat1, long1, lat2, long2, rowData, row);
}
function calculateHopDistanceAzimuth(lat1, long1, lat2, long2, rowData, row) {
  var R = 6371; //Radius of the earth in km
  var deglat = deg2rad(lat2 - lat1);
  var deglong = deg2rad(long2 - long1);
  var deglat1 = deg2rad(lat1);
  var deglat2 = deg2rad(lat2);
  var deglong1 = deg2rad(long1);
  var deglong2 = deg2rad(long2);

  // Calculating hop distance/ link distance
  var a =
    Math.sin(deglat / 2) * Math.sin(deglat / 2) +
    Math.sin(deglong / 2) *
      Math.sin(deglong / 2) *
      Math.cos(deglat1) *
      Math.cos(deglat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = Math.round(R * c * 100) / 100; // Distance in km

  // Calculating azimuth angle
  var y = Math.sin(deglong2 - deglong1) * Math.cos(deglat2);
  var x =
    Math.cos(deglat1) * Math.sin(deglat2) -
    Math.sin(deglat1) * Math.cos(deglat2) * Math.cos(deglong2 - deglong1);
  var brng = Math.atan2(y, x);
  brng = rad2deg(brng);
  var anglea = Math.round((brng + 360) % 360);
  var angleb = Math.round((anglea - 180 + 360) % 360);

  // add the hop distance and azimuth for Site A and B in the table

  var cell1 = row.insertCell(-1);
  var cell2 = row.insertCell(-1);
  var cell3 = row.insertCell(-1);
  cell1.innerHTML = distance + " Km";
  cell2.innerHTML = anglea + "°";
  cell3.innerHTML = angleb + "°";

  // function to calculate fresnel radius
  fresnelRadius(distance, rowData, row);
}

// converts from degree to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Converts from radians to degrees.
function rad2deg(rad) {
  return (rad * 180) / Math.PI;
}

//   function to calculate fresnel radius
function fresnelRadius(distance, rowData, row) {
  var frequency = rowData[6];
  console.log("Channel Frequency", frequency);
  var fres = (17.32 * Math.sqrt(distance / ((4 * frequency) / 1000))).toFixed(
    2
  );
  var cell1 = row.insertCell(-1);
  cell1.innerHTML = fres + " m";

  //   calling function which will calculate the rsl
  getTxPower(distance, rowData, row);
}

// function to get transmit power based on eirp
function getTxPower(distance, rowData, row) {
  var rslArray = [];
  var txArray = [];
  var radios = [rowData[7], rowData[8]];
  var gain = [rowData[9], rowData[10]];
  for (k = 0; k < 2; k++) {
    var antGain = parseFloat(gain[k]);
    var bandwidth = rowData[5];
    var frequency = rowData[6];
    var cableLoss = 2;
    // calling function for the value of transmit power and the EIRP and storing it in the report table
    var txEirp = calculateTxPower(frequency, antGain, cableLoss, row);
    var txPower = txEirp[0];
    var eirp = txEirp[1];
    txArray.push(txPower);

    // rsl calculate
    var eirpVal = antGain + txPower - cableLoss;
    var rsl =
      txPower < 3
        ? "N/A"
        : (
            eirpVal -
            (20 * Math.log10(distance) +
              20 * Math.log10(frequency / 1000) +
              92.45)
          ).toFixed(2);

    // storing the calculated value of rsl for both uplink and downlink

    rslArray.push(rsl);
  }
  var cell1 = row.insertCell(-1);
  cell1.innerHTML = eirp + " dBm";
  var cell2 = row.insertCell(-1);
  var cell3 = row.insertCell(-1);
  cell2.innerHTML = txArray[0] + " dBm";
  cell3.innerHTML = txArray[1] + " dBm";
  populateRSL(rslArray, bandwidth, row);
}

//   function to calculate rsl
function populateRSL(rslArray, bandwidth, row) {
  // calling function which will provide antenna gain value and transmit power as per the radio and eirp
  for (let k = 0; k < 2; k++) {
    // adding the calculated data to the table
    var cell1 = row.insertCell(-1);
    cell1.innerHTML = rslArray[k] + " dBm";
  }
  calculateSNR(bandwidth, row);
  calculateFadeMargin(row);
}

// function to calculate the snr
function calculateSNR(bandwidth, row) {
  for (k = 0; k < 2; k++) {
    var index = 20 + k;
    var nf = getNoiseFloor(bandwidth);
    console.log("Noise Floor", nf);
    var rsl = $(`#datatable tr:last-child td:eq(` + index + `)`).text();
    console.log(rsl);

    var snr =
      rsl == "N/A dBm" ? "N/A" : (parseFloat(rsl) + parseFloat(nf)).toFixed(2);
    console.log(snr);
    // adding the calculated data to the table
    var cell1 = row.insertCell(-1);
    cell1.innerHTML = snr + " db";
  }
}

var referencetable1, referencetable2;
function getNoiseFloor(bandwidth) {
  var noisefloor;
  switch (parseInt(bandwidth)) {
    case 10:
      noisefloor = 89;
      referencetable1 = document.getElementById("10MHz");
      referencetable2 = document.querySelector("#UBAX10MHz");
      break;
    case 20:
      noisefloor = 89;
      referencetable1 = document.getElementById("20MHz");
      referencetable2 = document.querySelector("#UBAX20MHz");
      break;
    case 40:
      noisefloor = 86;
      referencetable1 = document.getElementById("40MHz");
      referencetable2 = document.querySelector("#UBAX40MHz");
      break;
    case 80:
      noisefloor = 83;
      referencetable1 = document.getElementById("80MHz");
      referencetable2 = document.querySelector("#UBAX80MHz");
      break;
    default:
      console.log("bandwidth didnot match");
  }
  return noisefloor;
}

function gainForRadio(radio) {
  var matchFound = false;
  var tableLength = $("#radioTable tr").length;
  var antGain;
  $("#radioTable tr").each(function () {
    var cellValue = $(this).find("td:first").text();
    console.log(cellValue);

    if (cellValue == radio) {
      console.log(cellValue, radio);
      antGain = $(this).find("td:last").text();
      matchFound = true;
      return false;
    }
  });
  if (!matchFound) {
    console.log("No such Radio");
  }
  return antGain;
}

var refertable;
function calculateFadeMargin(row) {
  var mcsarray = [];
  var modulationarray = [];
  var fecarray = [];
  var linkratearray = [];
  var throughputarray = [];
  var radio1index = $("#datatable th:contains('Radio Near End')").index();
  var radio2index = $("#datatable th:contains('Radio Far End')").index();
  var radioindexarray = [radio1index, radio2index];
  for (k = 0; k < 2; k++) {
    var index = 20 + k;
    var radioName = $(
      `#datatable tr:last-child td:eq(` + radioindexarray[k] + `)`
    ).text();

    var rsl = $(`#datatable tr:last-child td:eq(` + index + `)`).text();

    // selecting the table to use based on the radio from either UBac or UBax family
    if (radioName.includes("x")) {
      refertable = referencetable2;
    } else {
      refertable = referencetable1;
    }
    // calcuating fade margin
    var fademargin =
      rsl == "N/A dBm"
        ? "N/A"
        : (
            parseFloat(rsl) -
            parseFloat(refertable.rows[2].cells.item(0).innerHTML)
          ).toFixed(2);

    // adding the calculated fade margin into the table
    var cell1 = row.insertCell(-1);
    cell1.innerHTML = fademargin + " db";

    var rowlength = refertable.rows.length;
    for (let t = 1; t < rowlength; t++) {
      var min = refertable.rows[t].cells.item(0).innerHTML;
      var max = refertable.rows[t].cells.item(1).innerHTML;
      if (rsl == "N/A dBm") {
        var mcs = "N/A";
        var modulation = "N/A";
        var fec = "N/A";
        var linkrate = "N/A";
        var throughput = "N/A";
      } else if (parseFloat(rsl) >= min && parseFloat(rsl) <= max) {
        var mcs = refertable.rows[t].cells.item(2).innerHTML;
        var modulation = refertable.rows[t].cells.item(3).innerHTML;
        var fec = refertable.rows[t].cells.item(4).innerHTML;
        var linkrate = refertable.rows[t].cells.item(5).innerHTML;
        var throughput = refertable.rows[t].cells.item(6).innerHTML;
      } else if (parseFloat(rsl) < min) {
        break;
      } else {
        continue;
      }
    }
    mcsarray.push(mcs);
    modulationarray.push(modulation);
    fecarray.push(fec);
    linkratearray.push(linkrate);
    throughputarray.push(throughput);
  }
  entermcsdata(mcsarray, row);
  entermodulationdata(modulationarray, row);
  enterfecdata(fecarray, row);
  enterlinkratedata(linkratearray, row);
  enterthroughputdata(throughputarray, row);
  availability(row);
}

function entermcsdata(mcsarray, row) {
  for (let k = 0; k < 2; k++) {
    var cell1 = row.insertCell(-1);
    cell1.innerHTML = mcsarray[k];
  }
}

function entermodulationdata(modulationarray, row) {
  for (let k = 0; k < 2; k++) {
    var cell1 = row.insertCell(-1);
    cell1.innerHTML = modulationarray[k];
  }
}

function enterfecdata(fecarray, row) {
  for (let k = 0; k < 2; k++) {
    var cell1 = row.insertCell(-1);
    cell1.innerHTML = "'" + fecarray[k] + "'";
  }
}

function enterlinkratedata(linkratearray, row) {
  for (let k = 0; k < 2; k++) {
    var cell1 = row.insertCell(-1);
    cell1.innerHTML = linkratearray[k] + " Mbps";
  }
}

function enterthroughputdata(throughputarray, row) {
  for (let k = 0; k < 2; k++) {
    var cell1 = row.insertCell(-1);
    cell1.innerHTML = throughputarray[k] + " Mbps";
  }
}

function availability(row) {
  var throughput = $(`#datatable tr:last-child td:eq(35)`).text();
  if (throughput != "N/A Mbps") {
    // heights from the data table in the report
    var height1index = parseFloat(
      $("#datatable th:contains('Height Near End')").index()
    );
    var height2index = parseFloat(
      $("#datatable th:contains('Height Far End')").index()
    );
    var height1 = parseFloat(
      $("#datatable tr:last-child td:eq(" + height1index + ")").text()
    );
    var height2 = parseFloat(
      $("#datatable tr:last-child td:eq(" + height2index + ")").text()
    );

    // fade margin from the data table in the report
    var fademargin1index = $(
      "#datatable th:contains('Fade Margin Near End')"
    ).index();
    var fademargin2index = fademargin1index + 1;
    var fademargin1 = parseFloat(
      $("#datatable tr:last-child td:eq(" + fademargin1index + ")").text()
    );
    var fademargin2 = parseFloat(
      $("#datatable tr:last-child td:eq(" + fademargin2index + ")").text()
    );

    // link distance and frequency
    var hopdistanceindex = $("#datatable th:contains('Hop Distance')").index();
    var hopdistance = parseFloat(
      $("#datatable tr:last-child td:eq(" + hopdistanceindex + ")").text()
    );

    var frequencyindex = $(
      "#datatable th:contains('Channel Frequency')"
    ).index();
    var frequency = parseFloat(
      $("#datatable tr:last-child td:eq(" + frequencyindex + ")").text()
    );
    console.log(frequency);

    //  Calculating the Antenna Tilt / Vertical Angle and populating them in the Link Installation Report
    vertical_angle =
      Math.atan((height1 - height2) / (hopdistance * 1000)) * (180 / Math.PI);

    // performing calculation for link availability
    var minFadeMargin = Math.min(fademargin1, fademargin2);
    var climaticFactor = 0.5;
    var terrainFactor = 4;
    var outageDueToFading =
      terrainFactor *
      climaticFactor *
      6 *
      Math.pow(10, -7) *
      (frequency / 1000) *
      Math.pow(hopdistance, 3) *
      Math.pow(10, -(minFadeMargin / 10));

    var linkAvailability = (100 * (1 - 2 * outageDueToFading)).toFixed(4);
    // creating a cell for the availability and populating the entered value in the table
    var cell1 = row.insertCell(-1);
    var cell2 = row.insertCell(-1);
    var cell3 = row.insertCell(-1);
    var cell4 = row.insertCell(-1);
    cell1.innerHTML = vertical_angle.toFixed(4) + "°";
    cell2.innerHTML = -vertical_angle.toFixed(4) + "°";
    cell3.innerHTML = linkAvailability + "%";
    cell4.innerHTML = "Yes";
  } else {
    // creating a cell for the availability and populating the entered value in the table
    var cell1 = row.insertCell(-1);
    var cell2 = row.insertCell(-1);
    var cell3 = row.insertCell(-1);
    var cell4 = row.insertCell(-1);

    cell1.innerHTML = "N/A";
    cell2.innerHTML = "N/A";
    cell3.innerHTML = "N/A";
    cell4.innerHTML = "No";
  }
}

// function to color the polyline based on the availabiliy of the link
function setColorPolyline(i) {
  var feasibiityIndex = $("#datatable th:contains(`Link Feasibility`)").index();
  var linkFeasibility = $(
    "#datatable tr:last-child td:eq(" + feasibiityIndex + ")"
  ).text();
  var polylineColor = linkFeasibility == "Yes" ? "Green" : "Red";
  polylinearray[i].setOptions({ strokeColor: polylineColor });

  /*info window which will be attached to the markers to make user understand 
  that thiese markers belong to which site number*/

  var infoWindow = new google.maps.InfoWindow({
    content: `Site ${i + 1}`,
    content: `<div style="color:polylinecolor">Site${i + 1}</div>`,
  });

  // show the infowindow by defualt al the time
  // infoWindow.open(importptpmap, markerarray[i + 2]);
}
