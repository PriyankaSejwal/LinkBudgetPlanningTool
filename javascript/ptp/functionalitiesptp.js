// when the calculate button is clicked
$("#latLongBtn").click(function () {
  $(".subscribedBandwidthAlert").fadeOut();
  var subscriberBw = $("#subscribedBandwidth").val();
  if (subscriberBw != "" && matchedRow) {
    $(".emptySubscriberBwAlert").fadeOut();
    // hopazimuth();
    // calcFresnel();
    // deviceinfo();
    inputMarker();
  } else {
    $(".emptySubscriberBwAlert").fadeIn().delay("slow");
  }
});

// report button
$("#ptpreportbtn").click(function () {
  reportMarker();
});

// for (let i = 1; i <= 2; i++) {
//   $(`#radio${i}`).change(function () {
//     // value of EIRP
//     var eirp = parseInt($("#ptpeirpMax").val());
//     // gain value for the selected radio
//     var r = parseInt($(`#radio${i}`).val().split(",")[0]);
//     // populating the va;ue of the antenna gain in the gain field
//     $(`#antgain${i}`).val(r);
//     var gain = $(`#antgain${i}`);
//     var cableloss = $(`#cableLoss${i}`);
//     var optionGroup = $(`#radio${i} option:selected`).parent().prop("label");
//     var gainalert = $(`.gain${i}Alert`);
//     var empty = document.querySelectorAll(`.empty`);
//     if (optionGroup == "External Antenna") {
//       extRadio(gain, cableloss, gainalert, empty);
//     } else {
//       otherRadio(gain, cableloss, gainalert);
//       calcTxPower();
//     }
//     if (r < eirp) {
//       $(`.gainEirpAlert${i}`).fadeOut();
//       // extracting the name/type and family of the radio
//       var radioType1 = $("#radio1 option:selected").attr("class");
//       var radioType2 = $("#radio2 option:selected").attr("class");

//       if (radioType1 == radioType2) {
//         // function called to refer the mcs table
//         checkRadios();
//         // alert about same family
//         $(`.radioAlert`).hide();
//       } else {
//         $(`.radioAlert`).show();
//       }
//     } else {
//       console.log(
//         "EIRP is smaller than the gain for the selected radio we can not proceed further"
//       );
//       $(`.gainEirpAlert${i}`).fadeIn();
//     }
//   });
// }

function extRadio(gain, loss, gainAlert, empty) {
  gain.val("");
  gain.prop("disabled", false);
  gain.addClass("extAnt");
  loss.prop("disabled", false);
  loss.addClass("extAnt");
  ccode = $("#ptpctryCode").val();
  if (ccode == "nd") {
    gainAlert.hide();
  } else {
    gainAlert.show();
  }
  for (i in empty) {
    console.log(empty[i].innerHTML);
    empty[i].innerHTML = "";
  }
}
function otherRadio(gain, loss, gainAlert) {
  gain.prop("disabled", true);
  gain.removeClass("extAnt");
  loss.prop("disabled", true);
  loss.removeClass("extAnt");
  gainAlert.hide();
}

// function to convert the co-ordinates from degree to radian for calculations

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// function to convert radian to degree
// Converts from radians to degrees.
function rad2deg(rad) {
  return (rad * 180) / Math.PI;
}

//LINK DISTANCE AND AZIMUTH ANGLE
// function to calculate link distance, azimuth angle
function hopazimuth() {
  var arr = document.getElementsByClassName("towerinput");
  var latlongarr = [];
  Array.from(arr).forEach(function (e) {
    latlongarr.push(e.value.split(","));
  });
  var latA = latlongarr[0][0];
  var latB = latlongarr[1][0];
  var longA = latlongarr[0][1];
  var longB = latlongarr[1][1];
  var R = 6371; //Radius of the earth in km
  var deglat = deg2rad(latB - latA);
  var deglong = deg2rad(longB - longA);
  var deglat1 = deg2rad(latA);
  var deglat2 = deg2rad(latB);
  var deglong1 = deg2rad(longA);
  var deglong2 = deg2rad(longB);

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
  // Populating the calculated values
  document.getElementById("linkDistance").innerHTML = distance;
  console.log(distance);
  document.getElementById("reportlinkdistance").innerHTML = distance;
  document.getElementById("reportHeadingA").innerHTML = anglea + "°";
  document.getElementById("reportHeadingB").innerHTML = angleb + "°";

  // fresneleirp();
}

function checkReferringTable(radioFamily) {
  tablecontainer = radioFamily + "-table";
  checkBandwidth();
}

// function whihc will check the bandwidth and will give value of noise floor and table for UBAX and normal table
// referencetable1 for the radio at site A and reference table 2 is for the radio at site B
var referencetable1, referencetable2, bandwidthLoss;
function checkBandwidth() {
  // check radios function would check the radio and then will give the table container name.
  // checkRadios();
  var bw = parseInt($("#ptpchannelBandwidth").val());
  $("#reportbandwidth").html(bw);

  switch (bw) {
    case 10:
      noisefloor = 89;
      referencetable1 = document.querySelector("#" + tablecontainer + "-10MHz");
      // referencetable2 = document.querySelector(
      //   "#" + tablecontainerArray[1] + "-10MHz"
      // );
      break;
    case 20:
      noisefloor = 89;
      referencetable1 = document.querySelector("#" + tablecontainer + "-20MHz");
      bandwidthLoss = 0;
      // referencetable2 = document.querySelector(
      //   "#" + tablecontainerArray[1] + "-20MHz"
      // );
      break;
    case 40:
      noisefloor = 86;
      referencetable1 = document.querySelector("#" + tablecontainer + "-40MHz");
      bandwidthLoss = 3;
      // referencetable2 = document.querySelector(
      //   "#" + tablecontainerArray[1] + "-40MHz"
      // );
      break;
    case 80:
      noisefloor = 83;
      referencetable1 = document.querySelector("#" + tablecontainer + "-80MHz");
      bandwidthLoss = 6;
      break;
    // referencetable2 = document.querySelector(
    //   "#" + tablecontainerArray[1] + "-80MHz"
    // );
  }
  console.log(`The tables for ${bw} MHz used is: `, referencetable1);
}

// function to check the radio selected and update which table will be used
// const tablecontainerArray = [];
var tablecontainer;
function checkRadios() {
  var radioType1 = $("#radio1 option:selected").attr("class");
  // table for reference
  tablecontainer = radioType1 + "-table";
  // check bandwidth and the bandwidth based table
  checkBandwidth();
}

function calcFresnel() {
  var f = document.getElementById("ptpchannelFrequency");
  var cf = parseFloat(f.options[f.selectedIndex].innerHTML);
  document.getElementById("reportfrequency").innerHTML = f.value;

  // Calculating fresnel zone radius
  var distance = document.getElementById("linkDistance").innerHTML;
  if (distance) {
    var fres = (17.32 * Math.sqrt(distance / ((4 * cf) / 1000))).toFixed(2);
    // var fres = (fres * 60) / 100;

    // Populating value of fresnel radius
    $(`#fresnelRadius`).html(fres);
    $(`#reportfresradius`).html(fres);
  }
}

// function to calculate the max transmit power based on eirp and antenna gain
var maxTxArray = [];
function calcTxPower() {
  var eirp = parseInt($("#ptpeirpMax").val());
  // mcs based tx power
  if (matchedRow) {
    var mcsbasedtxpower = parseInt(
      referencetable1.rows[matchedRow].cells.item(7).innerHTML
    );
    for (let i = 1; i <= 2; i++) {
      var [antgain, allowedTx] = $(`#radio${i}`).val().split(",");
      // allowed transmit power based on our product family ub22/ubax
      allowedTx = parseFloat(allowedTx);
      antgain = parseFloat(antgain);
      var cableloss = parseInt($(`#cableLoss${i}`).val());
      // comparing the allowed tx as per the radi with the maxtx based on the country and the bandwidth

      // Calculated tx power for A B sites
      var txcalculated = eirp - antgain + cableloss;

      if (txcalculated < 3) {
        $(`.tx${i}Alert`).show();
      } else {
        $(`.tx${i}Alert`).hide();
        var maxtx = Math.min(
          txlimitctrybased,
          mcsbasedtxpower,
          allowedTx,
          txcalculated
        );
        // tx power for calculation
        $(`#transmitPower${i}`).val(maxtx);
        // setting the max attribute as the max tx calculated
        $(`#transmitPower${i}`).prop("max", maxtx);
        maxTxArray[i] = maxtx;
      }
    }
  } else {
    window.alert("The subscirber bandwidth is required to go ahead.");
  }
}

function updateTransmitPower(index) {
  // mcs based tx power
  if (matchedRow) {
    var mcsbasedtxpower = parseInt(
      referencetable1.rows[matchedRow].cells.item(7).innerHTML
    );
    var eirp = parseFloat($("#ptpeirpMax").val());
    var antennaGain = parseFloat($(`#antgain${index}`).val());
    var radiobasedmaxtx = parseFloat($(`#radio${index}`).val().split(",")[1]);
    var cableLoss = parseFloat($(`#cableLoss${index}`).val());
    // var transmitPower = parseFloat($(`#transmitPower${index}`).val());
    var txcalculated = eirp - antennaGain + cableLoss;
    var maxTxAllowed = Math.min(
      txlimitctrybased,
      mcsbasedtxpower,
      txcalculated,
      radiobasedmaxtx
    );
    $(`#transmitPower${index}`).val(maxTxAllowed);
    $(`#transmitPower${index}`).prop("max", maxTxAllowed);
    maxTxArray[index] = maxTxAllowed;
  } else {
    window.alert(
      "Transmit power cannot be updated as planned capacity field is empty."
    );
  }
}

// Qeury Selector for when user changes the tx power, checking whether tx falls in 3-27.

for (let i = 1; i <= 2; i++) {
  document
    .querySelector(`#transmitPower${i}`)
    .addEventListener("change", function () {
      var txpower = this.value;
      var maxTx = Number($(`#transmitPower${i}`).attr("max"));
      if (txpower < 3 || txpower > maxTx) {
        document.querySelector(`.tx${i}Alert2`).style.display = "block";
        empty = document.querySelectorAll(".empty");
        for (let i = 0; i < empty.length; i++) {
          empty[i].innerHTML = "";
        }
      } else {
        document.querySelector(`.tx${i}Alert2`).style.display = "none";
        $(`#reporttx${i}`).html(txpower);
        deviceinfo();
      }
    });

  // event listener for cable loss change to check whether the entered value lies in the range of cable loss or not
  $(`#cableLoss${i}`).change(function () {
    var loss = Number($(`#cableLoss${i}`).val());
    if (loss < 0 || loss > 6) {
      console.log("loss out of range");
      $(`.cable${i}Alert`).show();
      // removing the calculations from the link summary table
      empty = document.querySelectorAll(".empty");
      for (let j = 0; j < empty.length; j++) {
        empty[j].innerHTML = "";
      }
    } else {
      $(`.cable${i}Alert`).hide();
      updateTransmitPower(i);
      deviceinfo();
    }
  });
}

// New deviceinfo function
/* this function checks the throughput in the refer table and where there is a match the rsl sensitivity and
tx power is extracted, rsl is then calculated as rsl needs tx power, snr based on rsl is calculated,
fade margin based on rsl and sensitivity extrated is calcuated, and other extracted data like MCS, FEC etc
populated based on the table selected as per the radio and the bandwidth
*/

function deviceinfo() {
  // calling function checkBandwidth
  // checkBandwidth();
  var dist = parseFloat(document.getElementById("linkDistance").innerHTML);
  if (dist != "") {
    var f = document.getElementById("ptpchannelFrequency");
    var freq = parseFloat(f.options[f.selectedIndex].innerHTML);
    var loss1 = parseInt(document.getElementById("cableLoss1").value);
    var loss2 = parseInt(document.getElementById("cableLoss2").value);
    var gain1 = parseInt(document.getElementById("antgain1").value);
    var gain2 = parseInt(document.getElementById("antgain2").value);
    var tx1 = parseInt($("#transmitPower1").val());
    var tx2 = parseInt($("#transmitPower2").val());
    // the interference if added by the user then noise floor becomes equal to the interference
    var interference = $("#interference-val").val();
    var snrMatched, rslMatched;

    // data from the reference table with the matched row for the throughput
    var refertable = referencetable1;
    // data from the refering table for the product family
    var sensitivity = parseFloat(
      refertable.rows[matchedRow].cells.item(0).innerHTML
    );
    var minSNR = parseInt(refertable.rows[matchedRow].cells.item(1).innerHTML);
    var mcs = refertable.rows[matchedRow].cells.item(2).innerHTML;
    var modulation = refertable.rows[matchedRow].cells.item(3).innerHTML;
    var fec = refertable.rows[matchedRow].cells.item(4).innerHTML;
    var linkrate = refertable.rows[matchedRow].cells.item(5).innerHTML;
    var throughput = parseInt(
      refertable.rows[matchedRow].cells.item(6).innerHTML
    );
    var txpower = parseInt(refertable.rows[matchedRow].cells.item(7).innerHTML);
    console.log(
      "In function device info: tx power is ",
      txpower,
      "at mcs: ",
      mcs,
      "with throughput",
      throughput,
      "snr minimum",
      minSNR,
      "interference entered or noise floor considered is :",
      noisefloor
    );
    var fsl = (
      20 * Math.log10(dist) +
      20 * Math.log10(freq / 1000) +
      92.45
    ).toFixed(2);

    var rslArray = [
      gain1 + gain2 + tx2 - loss1 - loss2 - bandwidthLoss - fsl,
      gain1 + gain2 + tx1 - loss1 - loss2 - bandwidthLoss - fsl,
    ];
    var snrArray = [rslArray[0] + noisefloor, rslArray[1] + noisefloor];
    console.log(`The RSL values are ${rslArray} SNR values are ${snrArray}`);
    if (
      rslArray[0] >= sensitivity &&
      rslArray[1] >= sensitivity &&
      snrArray[0] >= minSNR &&
      snrArray[1] >= minSNR
    ) {
      rslMatched = true;
    } else {
      rslMatched = false;
    }
    // check for interference
    var cinrArray;
    if (interference) {
      interference = parseInt(interference);
      $(".cinr-hidden").css("display", "table-row");
      cinrArray = [rslArray[0] + interference, rslArray[1] + interference];
    } else {
      $(".cinr-hidden").css("display", "none");
    }

    console.log("rsl snr values matched? ", rslMatched);
    var rslIndexMatched, snrIndexMatched;
    if (rslMatched) {
      for (let i = 1; i <= 2; i++) {
        // Fade Margin
        var fademargin = (rslArray[i - 1] - parseFloat(sensitivity)).toFixed(2);
        var radioName = $(`#radio${i} option:selected`).html();
        // Populating the link setting values
        $(`#reportRadio${i}`).html(radioName);
        $(`#reportloss${i}`).html(eval("loss" + i));
        $(`#reporttx${i}`).html(txpower);
        $(`#reportAntGain${i}`).html(eval("gain" + i));
        // Populating all the calculated value now in the fields
        // RSL
        document.getElementById(`rsl${i}`).innerHTML =
          rslArray[i - 1].toFixed(2);
        document.getElementById(`reportrsl${i}`).innerHTML =
          rslArray[i - 1].toFixed(2);
        // SNR
        $(`#snr${i}`).html(snrArray[i - 1].toFixed(2));
        $(`#reportsnr${i}`).html(snrArray[i - 1].toFixed(2));
        // CINR
        $(`#cinr${i}`).html(cinrArray);
        $(`#reportcinr${i}`).html(cinrArray);
        // Fade Margin
        $(`#fadeMargin${i}`).html(fademargin);
        // MCS
        $(`#mcs${i}`).html(mcs);
        // Modulation
        $(`#modulation${i}`).html(modulation);
        // FEC
        $(`#fec${i}`).html("'" + fec);
        // Link Rate
        $(`#linkRate${i}`).html(linkrate);
        // Throughput
        $(`#throughput${i}`).html(throughput / 2);
        $(`#reportthroughput${i}`).html(throughput / 2);

        if (radioName.includes("CPE") && throughput > 300) {
          $(`#throughput${i}`).html(150);
          $(`#reportthroughput${i}`).html(150);
          //   }
        }
      }
      availability();
      // function which will tell the max MCS achievable
      maximumAchievableThroughput();
    } else {
      //when calculated snr is not smaller than minSNR, snr is not matched with the criteria
      var tablelength = refertable.rows.length;
      var minrslcalculated = Math.min(...rslArray);
      var minsnrcalculated = Math.min(...snrArray);
      console.log(
        `When no match found, then min snr calculated is ${minsnrcalculated} and min snr required is ${minSNR},  min rsl calculated is ${minrslcalculated} and sensitivity is ${sensitivity}`
      );
      // finding out the mcs match based on rsl
      for (let t = 1; t < tablelength; t++) {
        var sensitivity = parseInt(refertable.rows[t].cells.item(0).innerHTML);
        if (minrslcalculated < sensitivity) {
          rslIndexMatched = true;
          rslIndex = t - 1;
          break;
        }
      }
      // finding out mcs match based on snr
      for (let t = 1; t < tablelength; t++) {
        var minSNR = parseInt(refertable.rows[t].cells.item(1).innerHTML);
        if (minsnrcalculated < minSNR) {
          snrIndexMatched = true;
          snrIndex = t - 1;
          break;
        }
      }
      // going forward with the smallest index of the two
      if (snrIndexMatched && rslIndexMatched) {
        var minIndex = Math.min(rslIndex, snrIndex);
        var throughput = refertable.rows[minIndex].cells.item(6).innerHTML;
        window.alert(
          ` With given user inputs (SNR ${minsnrcalculated}dB, rsl ${minrslcalculated}), we can achieve maximum throughput of ${throughput}Mbps.`
        );
        // removing the calculations from the link summary table
        empty = document.querySelectorAll(".empty");
        for (let j = 0; j < empty.length; j++) {
          empty[j].innerHTML = "";
        }
      }
      // empty the field where we were giving message about the max achievabele throughput
      $("#maxThroughputMcs").html("");
    }
  }
}

function maximumAchievableThroughput() {
  var mcs,
    throughput,
    txpower,
    newrsl1,
    newsnr1,
    differenceTx,
    rslMatched,
    rslIndex,
    snrMatched,
    snrIndex,
    mainIndex;
  var refertable = referencetable1;
  var txpower1 = parseInt($(`#transmitPower1`).val());
  var txpower2 = parseInt($(`#transmitPower2`).val());
  var rsl1 = parseFloat($(`#rsl1`).html());
  var rsl2 = parseFloat($(`#rsl2`).html());
  var mcs1 = parseInt($(`#mcs1`).html());
  var mcs2 = parseInt($(`#mcs2`).html());
  var minRsl = Math.min(rsl1, rsl2);
  var maxMcs = Math.max(mcs1, mcs2);
  var tablelength = refertable.rows.length;
  for (let t = 1; t < tablelength; t++) {
    var sensitivity = parseInt(refertable.rows[t].cells.item(0).innerHTML);
    if (sensitivity > minRsl) {
      txpower = refertable.rows[t - 1].cells.item(7).innerHTML;
      break;
    }
  }
  differenceTx = txpower1 - txpower;
  newrsl1 = rsl1 - differenceTx;
  newsnr1 = newrsl1 + noisefloor;
  console.log(`New RSL calculated is: ${newrsl1}, new SNR is ${newsnr1}`);
  for (let t = 1; t < tablelength; t++) {
    var sensitivity = parseInt(refertable.rows[t].cells.item(0).innerHTML);
    if (sensitivity > newrsl1) {
      rslIndex = t - 1;
      rslMatched = true;
      break;
    }
  }
  for (let t = 1; t < tablelength; t++) {
    var minSNR = parseInt(refertable.rows[t].cells.item(1).innerHTML);
    if (minSNR > newsnr1) {
      snrIndex = t - 1;
      snrMatched = true;
      break;
    }
  }
  console.log(snrMatched, rslMatched, snrIndex, rslIndex);
  if (rslMatched && snrMatched) {
    mainIndex = Math.min(rslIndex, snrIndex);
    mcs = refertable.rows[mainIndex].cells.item(2).innerHTML;
    throughput = refertable.rows[mainIndex].cells.item(6).innerHTML;
  }
  if (maxMcs < mcs) {
    $("#maxThroughputMcs").html(
      `Note:- Throughput of ${throughput} Mbps (MCS ${mcs}) can also be achieved, if desired.`
    );
  } else {
    $("#maxThroughputMcs").html("");
  }
}

// Function to calculate LINK AVAILABILITY
function availability() {
  var snr1 = $("#snr1").html();
  if (snr1 != "" || snr1 != "N/A") {
    var anthta = parseFloat(document.getElementById("aheight1").value);
    var anthtb = parseFloat(document.getElementById("aheight2").value);
    var min_antht = Math.min(anthta, anthtb);
    var linkdist = parseFloat(
      document.getElementById("linkDistance").innerHTML
    );
    var path_inclination = Math.abs((anthta - anthtb) / linkdist);
    var f = document.getElementById("ptpchannelFrequency");
    var freq = parseFloat(f.options[f.selectedIndex].innerHTML);
    var flat_fade_margin1 = parseFloat(
      document.getElementById("fadeMargin1").innerHTML
    );
    var flat_fade_margin2 = parseFloat(
      document.getElementById("fadeMargin2").innerHTML
    );
    var flat_fade_margin = Math.min(flat_fade_margin1, flat_fade_margin2);
    // Availability as per Sir's Tool
    // var geoclimatic_factor = 0.00003647539;
    // var fading_occurance_factor =
    //   (geoclimatic_factor *
    //     linkdist ** 3.1 *
    //     (1 + path_inclination) ** -1.29 *
    //     (freq / 1000) ** 0.8 *
    //     10 ** (-0.00089 * min_antht - flat_fade_margin / 10)) /
    //   100;
    // var fade_depth = 25 + 1.2 * Math.log10(fading_occurance_factor);
    // var flat_fade_exceeded_in_WM = 1 - (1 - 2 * fading_occurance_factor);
    // var link_availability_due_to_multipath = (1 - flat_fade_exceeded_in_WM) * 100;

    // Availability as per ITU R P 530
    var terrain_fac = 4;
    var climate_fac = 0.5;
    var outageDueToFading =
      terrain_fac *
      climate_fac *
      6 *
      Math.pow(10, -7) *
      (freq / 1000) *
      Math.pow(linkdist, 3) *
      Math.pow(10, -(flat_fade_margin / 10));

    var linkAvailability = (100 * (1 - 2 * outageDueToFading)).toFixed(4);
    console.log("fading occurance factor", linkAvailability);

    linkAvailability = linkAvailability === 100 ? 100 : linkAvailability;

    //  populating the link availability column with the value calculated
    document.getElementById("reportlinkAvailability").innerHTML =
      linkAvailability + " ";
    document.getElementById("linkAvailability").innerHTML = linkAvailability;
  }
}
