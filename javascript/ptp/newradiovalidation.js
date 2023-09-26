// VALIDATION FOR GAIN AND TX POWER TO BE IN ALLOWED RANGE
$("#radioGain").change(function () {
  console.log("Gain validation getting read");
  var gain = $(this).val();
  if (gain <= 50 && gain >= 0) {
    $("#outOfRangeNewGain").fadeOut();
  } else {
    $("#outOfRangeNewGain").fadeIn();
  }
});
// Radio Power validation
$("#radioPower").change(function () {
  var power = $(this).val();
  if (power >= 3 && power <= 30) {
    $("outOfRangeNewPower").fadeOut();
  } else {
    $("outOfRangeNewPower").fadeIn();
  }
});

//   VALIDATION FUNCTION FOR THE RSL SENSITIVITY ENTERED IN EACH TABLE ROW
function validateMinRSL(event, j, k) {
  if (j > 1) {
    var currentrslVal = parseInt($(event.target).val());
    if (k == 1 || k == 7) {
      var currentcell = $(event.target).closest("td");
      var previousRow = currentcell.closest("tr").prev();
      var previousCell = previousRow.find("td").eq(currentcell.index());
      var prevrslVal = previousRow
        .find("td")
        .eq(currentcell.index())
        .find("input")
        .val();
      if (prevrslVal >= currentrslVal) {
        $(event.target).css("border-color", "red");
      } else {
        $(event.target).css("border-color", "");
      }
    }
    if (k == 8) {
      var currentcell = $(event.target).closest("td");
      var previousRow = currentcell.closest("tr").prev();
      var previousCell = previousRow.find("td").eq(currentcell.index());
      var prevrslVal = previousRow
        .find("td")
        .eq(currentcell.index())
        .find("input")
        .val();
      if (prevrslVal < currentrslVal) {
        $(event.target).css("border-color", "red");
      } else {
        $(event.target).css("border-color", "");
      }
    }
  }
}
