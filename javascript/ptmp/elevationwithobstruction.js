// this javascript file contains code which updates the elevation chart with the obstruction data
var obsindexarray = [[], [], [], [], [], [], [], [], [], [], [], [], []];
var obsarray = [[], [], [], [], [], [], [], [], [], [], [], [], []];
function getdatafromobslist(i) {
  var obsarr = [];
  var index = [];
  // calling the correct list for the slave
  var obslist = document.querySelectorAll(`.obsli${i}`);
  Array.from(obslist).forEach(function (e) {
    var datasplit = e.textContent.split(",");
    var obsdist = datasplit[0];
    var obsheight = parseFloat(datasplit[1]);
    var diffarray = [];
    // elevation data
    var distelevationarr = distelevation[i];
    for (let j = 0; j < distelevationarr.length; j++) {
      var diff = (obsdist - distelevationarr[j][0]).toFixed(2);
      diffarray.push(Math.abs(diff));
    }
    /* index of the minimum difference between the distance entered by the
         user in obstruction and distance in elevation chart*/
    var indexmindiff = diffarray.indexOf(Math.min(...diffarray));
    console.log(
      `elevation at ${indexmindiff} is ${distelevationarr[indexmindiff]}`
    );
    var newobsheight = obsheight + distelevationarr[indexmindiff][1];
    obsarr.push([parseFloat(obsdist), parseFloat(newobsheight)]);
    index.push(indexmindiff);
  });
  obsarray[i] = obsarr;
  obsindexarray[i] = index;

  //   creating datatable so that we can plot the obstruction in chart
  obsdata = new google.visualization.DataTable();
  obsdata.addColumn("number", "distance");
  obsdata.addColumn("number", "obstruction");
  obsdata.addRows(obsarray[i]);

  return obsdata;
}
function updateElevationWithObstruction(i) {
  console.log("elevation after obstruction function");
  var data4 = getdatafromobslist(i);
  if ($(`#obsUL${i}`).html() != "") {
    console.log("obs data present");
    elevationChartWithObstruction(i, data4);
  } else {
    console.log("The draw chart is called as no obstruction data present");
    // drawChart(allElevation[i][0], i);
    drawChartWhenObstructionDataDeleted(i);
  }
  availability(i);
  /*after height change for slave where los was not clear initially, we had throughput as N/A, 
  as los now will get clear after heigth change we need to get the throughput value to do the 
  calculations again */
  throughputUpdationAfterHeightChange(i);
  ptmpMasterThroughput();
  ptmpSlaveThroughput();
  ULDLThroughput();
}
function elevationChartWithObstruction(i, data4) {
  var ellipsearray = lowerellipsearray[i];
  obstructionjoined = google.visualization.data.join(
    alljoineddata[i],
    data4,
    "full",
    [[0, 0]],
    [1, 2, 3],
    [1]
  );
  // we have obstruction in the chart so checking if obstruction is clear of the fresnel zone
  for (let k = 0; k < obsindexarray[i].length; k++) {
    var obsdata = obsarray[i];
    var index = obsindexarray[i];
    if (obsdata[k][1] > ellipsearray[index[k]][1]) {
      $(`#LOS${i}1`).html("No");
      $(`#reportSlave${i}LOS0`).html("No");
      $(`#reportSlave${i}LOS1`).html("No");
      $(`#LOS${i}1`).css({ color: "red" });
      break;
    } else {
      $(`#LOS${i}1`).html("Yes");
      $(`#reportSlave${i}LOS0`).html("Yes");
      $(`#reportSlave${i}LOS1`).html("Yes");
      $(`#LOS${i}1`).css({ color: "green" });
    }
  }

  // checking if slave is in range then only we proceed to change the color of the line based on los
  var slaverange = document.getElementById(`In Range${i}1`).innerHTML;
  if (slaverange == "Yes") {
    if ($(`#LOS${i}1`).html() == "No") {
      polyLine[i].setOptions({ strokeColor: "Red" });
      reportPolyline[i].setOptions({ strokeColor: "Red" });
      console.log("Red line after ht change");
    } else if ($(`#LOS${i}1`).html() == "Yes") {
      console.log("Green line after ht change");
      polyLine[i].setOptions({ strokeColor: "Green" });
      reportPolyline[i].setOptions({ strokeColor: "Green" });
    }
  }

  // chart options
  var options = {
    width: 400,
    height: 200,
    interpolateNulls: true,
    lineWidth: 1,
    colors: ["#037385", "#350964", "#350964", "#ff0000"],
    hAxis: {
      title: "Distance (in Km) ",
    },
    vAxis: {
      title: "Elevation (in m)",
    },
    legend: "none",
    seriesType: "line",
    series: { 0: { type: "area" }, 3: { type: "bars" } },
  };

  // Chart constructor for the main page of the website
  chart = new google.visualization.ComboChart(
    document.getElementById(`slave${i}Elevation`)
  );

  chart.draw(obstructionjoined, options);
  // availability(i);
  // var numOfSlaves = $(`#numberOfSlaves`).val();
  // var lastSlaveThroughput = $(`#Throughput${eval(numOfSlaves)}1`).html();
  // if (lastSlaveThroughput != "") {
  //   checkAvailability();
  //   ptmpMasterThroughput();
  //   ptmpSlaveThroughput();
  //   ULDLThroughput();
  // }
}

function drawChartWhenObstructionDataDeleted(i) {
  // emtying the chart container if it has any data
  $(`#slave${vals}Elevation`).html("");

  var dist = parseFloat($(`#Distance${vals}1`).html());
  var rad = parseFloat(
    document.getElementById(`Fresnel Radius${vals}1`).innerHTML
  );
  var htM = parseFloat($(`#masterHeight`).val());
  var htS = parseFloat($(`#slave${vals}Height`).val());

  // x-ticks array
  var tickarr = [];
  var tickSize = dist / 4;
  for (var i = 0; i <= dist; i += tickSize) {
    tickarr.push(i.toFixed(2));
  }

  //   data array for the ellipse
  startX = 0;
  endX = dist * Math.pow(10, 3);
  startY = yelev[0] + htM;
  endY = yelev[99] + htS;
  console.log(yelev[0], yelev[99], startX, endX);

  ellipsearray1 = [];

  // steps for the angle to make the ellipse
  var step = (2 * Math.PI) / 198;
  // Radius of the major axis
  var a =
    Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) * 0.5; // radius of major axis

  // angle of the rotation
  var w = Math.atan2(endY - startY, endX - startX);

  //for loop for 0 to 180 degree point of the ellipse
  for (i = 0; i <= Math.PI; i += step) {
    var xval = a * Math.cos(i);
    var yval = rad * Math.sin(i);
    var xnew = (startX + endX) / 2 + xval * Math.cos(w) - yval * Math.sin(w);
    var ynew = (startY + endY) / 2 + xval * Math.sin(w) + yval * Math.cos(w);
    ellipsearray1.push([xnew / 1000, ynew]);
  }
  //for loop for 180 to 360 degree point of the ellipse
  ellipsearray2 = [];
  for (i = Math.PI; i <= 2 * Math.PI; i += step) {
    var xval = a * Math.cos(i);
    var yval = rad * Math.sin(i);
    var xnew = (startX + endX) / 2 + xval * Math.cos(w) - yval * Math.sin(w);
    var ynew = (startY + endY) / 2 + xval * Math.sin(w) + yval * Math.cos(w);
    ellipsearray2.push([xnew / 1000, ynew]);
  }

  // saving lower ellipse for every slave in lowerellipsearray
  // lowerellipsearray[vals] = ellipsearray2;
  // data array for the elevation
  elevarr = [];
  distarray = [];
  stepsize = (dist * Math.pow(10, 3)) / 99;
  for (i = 0; i < 100; i++) {
    distarray.push(ellipsearray2[i][0]);
  }

  //  Elevation data both x values and y values
  for (i = 0; i < 100; i++) {
    elevarr.push([distarray[i], yelev[i]]);
  }
  // this is array which collects all the distance and elevation array for the slaves
  distelevation[vals] = elevarr;

  // LOS clear/unclear

  for (let i = 0; i < yelev.length; i++) {
    if (ellipsearray2[i][1] > yelev[i]) {
      $(`#LOS${vals}1`).html("Yes");
      $(`#reportSlave${vals}LOS0`).html("Yes");
      $(`#reportSlave${vals}LOS1`).html("Yes");
      $(`#LOS${vals}1`).css({ color: "green" });
      // polyLine[vals].setOptions({ strokeColor: "Green" });
      // reportPolyline[vals].setOptions({ strokeColor: "Green" });
    } else {
      $(`#LOS${vals}1`).html("No");
      $(`#LOS${vals}1`).css({ color: "red" });
      $(`#reportSlave${vals}LOS0`).html("No");
      $(`#reportSlave${vals}LOS1`).html("No");
      // polyLine[vals].setOptions({ strokeColor: "Red" });
      // reportPolyline[vals].setOptions({ strokeColor: "Red" });
      break;
    }
  }
  // checking if slave is in range then only we proceed to change the color of the line based on los
  var slaverange = document.getElementById(`In Range${vals}1`).innerHTML;
  if (slaverange == "Yes") {
    if ($(`#LOS${vals}1`).html() == "No") {
      polyLine[vals].setOptions({ strokeColor: "Red" });
      reportPolyline[vals].setOptions({ strokeColor: "Red" });
    }
  }

  // data 1 for the elevation
  var data = new google.visualization.DataTable();
  data.addColumn("number", "distance");
  data.addColumn("number", "elevation");
  data.addRows(elevarr);

  // data 2 for half of the ellipse
  var data2 = new google.visualization.DataTable();
  data2.addColumn("number", "distance");
  data2.addColumn("number", "fresnel");
  data2.addRows(ellipsearray1);

  // data 3 for other half of the ellipse
  var data3 = new google.visualization.DataTable();
  data3.addColumn("number", "distance");
  data3.addColumn("number", "fresnel");
  data3.addRows(ellipsearray2);
  console.log("In elevation", data, data2, data3);
  // joined data for elevation and first half of ellipse
  var joinedData1 = google.visualization.data.join(
    data,
    data2,
    "full",
    [[0, 0]],
    [1],
    [1]
  );

  // joined data for above and second half of ellipse
  joinedData2 = google.visualization.data.join(
    joinedData1,
    data3,
    "full",
    [[0, 0]],
    [1, 2],
    [1]
  );

  alljoineddata[vals] = joinedData2;

  var options = {
    width: 400,
    height: 200,
    interpolateNulls: true,
    lineWidth: 1,
    colors: ["#037385", "#350964", "#350964"],
    hAxis: {
      title: "Distance (in Km) ",
      ticks: tickarr,
    },
    vAxis: {
      title: "Elevation (in m)",
      textStyle: { fontSize: 12 },
      viewWindowMode: "explicit",
      min: 0,
      max: Math.max(...ellipsearray1),
    },
    legend: "none",
    seriesType: "line",
    series: { 0: { type: "area" } },
  };

  // Chart constructor for the main page of the website
  chart = new google.visualization.ComboChart(
    document.getElementById(`slave${vals}Elevation`)
  );

  chart.draw(joinedData2, options);
  $(`#slave${vals}Obstruction`).css("display", "block");
  // $(`#slave${vals}ReportElevation`).html($(`#slave${vals}Elevation`).html());
  yelevation = [];
}
