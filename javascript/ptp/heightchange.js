for (let i = 1; i <= 2; i++) {
  $(`#aheight${i}`).change(function () {
    heightUpdate();
  });
}
function heightUpdate() {
  var obstructionList = $("#obsUL").html();
  if (obstructionList == "") {
    availability();
    elevationchartptp();
    // present in map.js
  } else {
    availability();
    ObsChartWithHt();
    // present in obstruction.js
  }
}
