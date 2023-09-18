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
    var maxthroughput = refertable.rows[t].cells.item(6).innerHTML;
    if (maxthroughput >= subscriberBw) {
      matchedRow = t;
      break;
    }
  }
  // if we do not have matched row value then alert of no match found would be visible and
  //  all the link summary table data would be empty

  if (matchedRow) {
    $("#subscribedBandwidthAlert").hide();
    var latLngA = $("#searchtower1").val();
    var latLngB = $("#searchtower2").val();
    var distance = $("#linkDistance").html();
    /* update the maximum transmit power limit based on the country based tx limit,
    mcs based tx limit, radio based tx limit and calculated txbased on the eirp*/
    calcTxPower();
    // if any of the sites lat lng are missing then we know that the program needs to run from scratch
    // also if distance is not calculated and populated, then too we know the program needs to run from scratch
    if (latLngA !== "" || latLngB !== "") {
      if (distance !== "") {
        deviceinfo();
      } else {
        inputMarker();
      }
    } else {
    }
  } else {
    $(".subscribedBandwidthAlert").show();
    // removing the calculations from the link summary table
    empty = document.querySelectorAll(".empty");
    for (let j = 0; j < empty.length; j++) {
      empty[j].innerHTML = "";
    }
  }
});

// function which refers the table row based on the subscriber set bandwidth

// when user wants to enter interference
$("#add-interference").click(function () {
  /* hidden and shown the interference container where interferecne value can be
   added when the add interferecne clicked */
  $(".interference-container").toggle();
});

// interference value is added
$("#interference-val").change(function () {
  console.log("interference value is:", $(this).val());
  deviceinfo();
});
