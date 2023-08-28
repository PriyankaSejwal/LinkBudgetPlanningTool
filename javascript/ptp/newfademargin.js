var matchedRow;
$("#subscribedBandwidth").on("change", function () {
  $(".emptySubscriberBwAlert").fadeOut();
  var subscriberBw = parseInt($(this).val());
  // check whether site 1 , site 2 details are available along with the subsribed bandwidth.
  // buttonActive();
  // call device info for tx power, throughput data and sensitivity data from the table
  var refertable = referencetable1;
  matchedRow = null;
  var tablelength = refertable.rows.length;
  for (let t = 1; t < tablelength; t++) {
    var maxthroughput = refertable.rows[t].cells.item(5).innerHTML;
    if (maxthroughput > subscriberBw) {
      matchedRow = t;
      break;
    }
  }

  if (matchedRow) {
    $("#subscribedBandwidthAlert").hide();
    var latLngA = $("#searchtower1").val();
    var latLngB = $("#searchtower2").val();
    var distance = $("#linkDistance").html();
    // if any of the sites lat lng are missing then we know that the program needs to run from scratch
    // also if distance is not calculated and populated, then too we know the program needs to run from scratch
    if (latLngA !== "" || latLngB !== "") {
      if (distance !== "") {
        deviceinfo();
      } else {
        hopazimuth();
        calcFresnel();
        deviceinfo();
        inputMarker();
      }
    } else {
    }
  } else {
    $("#subscribedBandwidthAlert").show();
    // removing the calculations from the link summary table
    empty = document.querySelectorAll(".empty");
    for (let j = 0; j < empty.length; j++) {
      empty[j].innerHTML = "";
    }
  }
});
