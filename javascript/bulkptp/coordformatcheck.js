/* this javascript file contains all the functions that would check the format 
of the data that is entered in the excel */

function checkCoordinateFormat(latlongArray, rowData, row, i) {
  var decimalcoordArray = [];
  // decimalcoordArray.push([]);
  // var coordArrayLength = decimalcoordArray.length;
  for (let j = 0; j < 2; j++) {
    console.log(j);
    var lat = latlongArray[j][0];
    var long = latlongArray[j][1];
    // dms pattern which assumes that there can or cannot be one or many space after the dms symbols \s*?
    const dmsPattern =
      /^\s?-?\d{1,3}[°]\s*?\d{1,2}[']\s*?\d{1,2}(\.\d+)?["]\s*?[NSWE]\s?$/i;

    // Regular expression to match DD format (e.g. 40.446195, -79.948862)
    const ddPattern = /^\s?-?\d+(\.\d+)?°?\s?$/;
    if (dmsPattern.test(lat) && dmsPattern.test(long)) {
      var splitlat = lat.split(/[^\d\w\.\-\ ]+/);
      var ddlat = dmsToDD(splitlat);
      var splitlong = long.split(/[^\d\w\.\-\ ]+/);
      var ddlong = dmsToDD(splitlong);
      // console.log(`pushing ${ddlong} and ${ddlat} to array`);
      decimalcoordArray.push([ddlat.toFixed(6), ddlong.toFixed(6)]);
      if (j == 1) {
        console.log(decimalcoordArray);
        placeMarkerOnMap(decimalcoordArray, rowData, row, i);
      }
    } else if (ddPattern.test(lat) && ddPattern.test(long)) {
      var ddlat = parseFloat(lat);
      var ddlong = parseFloat(long);
      // console.log(`pushing ${ddlong} and ${ddlat} to array`);

      decimalcoordArray.push([ddlat.toFixed(6), ddlong.toFixed(6)]);
      if (j == 1) {
        console.log(decimalcoordArray);
        placeMarkerOnMap(decimalcoordArray, rowData, row, i);
      }
    } else {
      $(`#messageafterfileread`).html(
        `Please enter in either DMS(e.g. 40°26'46.302"N) or DD(e.g. 40.446195, -79.948862) format.`
      );
      $(`.import-message-section`).show();
      return false;
    }
  }
  // create span to capture the decimal coordinates for every link and store it in the container with id- addCoordData
  // $("<span>", { html: decimalcoordArray }).appendTo($("#addCoordData"));

  // console.log("Decimal Coordinate Array: ", decimalcoordArray);
  return true;
}

// function to convert dms to decimal
function dmsToDD(splitvalue) {
  var [deg, min, sec, direction] = splitvalue;
  var dd = Number(deg) + Number(min) / 60 + Number(sec) / (60 * 60);
  console.log(dd);
  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}

// function to check whether the radios belong to the same family either UB22(ac) or UB22(ax)
function checkRadio(radio1, radio2, i) {
  console.log(radio1, radio2);
  $(`.import-message-section`).show();
  if (
    (String(radio1).includes("4xl") && String(radio2).includes("4xl")) ||
    (String(radio1).includes("4l") && String(radio2).includes("4l"))
  ) {
  } else {
    $(`#forradiocheck`).html(`Radios in row ${i} belong to different family.`);
    return false;
  }
  return true;
}

// function to check the non-zero value for antgains
function checkantgainvalue(antgainA, antgainB, i) {
  if (
    parseInt(antgainA) > 0 &&
    parseInt(antgainA) <= 35 &&
    parseInt(antgainB) > 0 &&
    parseInt(antgainB) <= 35
  ) {
  } else {
    $("#forgaincheck").html(
      `Antenna Gain in row number ${i} is smaller than or equal to zero.`
    );
    return false;
  }
  return true;
}
