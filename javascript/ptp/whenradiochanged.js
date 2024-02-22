for (let i = 1; i <= 2; i++) {
  $(`#radio${i}`).change(function () {
    // as radio is changes first update the gain field
    let gain = this.value.split(",")[0];
    $(`#antgain${i}`).val(gain);
    /*storing gain, cable loss, group to which the radio belongs, alert of the gain field, 
        and all the fields starting from rsl in th elink summary table */
    var antennaGain = $(`#antgain${i}`);
    var cableLoss = $(`#cableLoss${i}`);
    var radioFamily = $(`#radio${i} option:selected`).parent().prop("label"); // ext,integrated etc.
    var gainAlert = $(`.gain${i}Alert`);
    var empty = document.querySelectorAll(".empty");

    // check wether the selected radio is from ubr family or ubax family
    var radioType1 = $(`#radio1 option:selected`).attr("class");
    var radioType2 = $(`#radio2 option:selected`).attr("class");
    var radioType = [radioType1, radioType2];
    var currentClass = $(`#radio${i} option:selected`).attr("class"); // ub22 or ubax
    var previousClass = tablecontainer.split("-")[0]; // ub22 or ubax

    if (radioType1 == radioType2) {
      if (currentClass != previousClass) {
        checkReferringTable(radioType[i]);
        mcsAsPerThroughput();
      }
      // hide the radio alert, if visible
      $(`.radioAlert`).hide();
    } else {
      $(`.radioAlert`).show();
    }

    // check whether the selected radio is an external radio or integrated
    if (radioFamily == "External Antenna") {
      extRadio(antennaGain, cableLoss, gainAlert, empty);
    } else {
      console.log("in radio change else part for other radio is also read");
      otherRadio(antennaGain, cableLoss, gainAlert);
      updateTransmitPower(i);
      deviceinfo();
    }
  });
}

function checkReferringTable(radioFamily) {
  tablecontainer = radioFamily + "-table";
  checkBandwidth();
}

function mcsAsPerThroughput() {
  var requiredThroughput = parseInt($("#subscribedBandwidth").val());
  if (requiredThroughput) {
    $(".subscribedBandwidthAlert").fadeOut();
    matchedRow = null;
    var tablelength = referencetable1.rows.length;
    for (let t = 1; t < tablelength; t++) {
      var maxthroughput = referencetable1.rows[t].cells.item(6).innerHTML;
      if (maxthroughput >= requiredThroughput) {
        matchedRow = t;
        break;
      }
    }
  } else {
    // $(".subscribedBandwidthAlert").show();
    window.alert("Desired throughput capacity field is empty.");
  }
}
