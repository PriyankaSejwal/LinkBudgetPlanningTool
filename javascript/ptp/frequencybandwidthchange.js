// function which were called when the bandwidth or the frequency is changed

$("#ptpchannelBandwidth").change(function () {
  checkBandwidth();
  // call function to create frequency list
  ptpfrequencydata();
  // ptpeirpcalculate();
  /*mcs refer will give the match for the mcs to refer now with the new bandwidth. 
  as when bandwidth is changed throughput is changed */
  mcsrefer();
  /*calc fresnel function has a check, it will only run if distance value is there.*/
  calcFresnel();
  if (matchedRow) {
    // after knowing the mcs row to refer its time to calculate the tx power.
    calcTxPower();
    deviceinfo();
  }
});

$("#ptpchannelFrequency").change(function () {
  // as changing the frequency changes the eirp and tx power as per ctry so calc tx power will be called
  // checkBandwidth();
  ptpeirpcalculate();
  // calc fresnel will be called only when the value of hop distance is present.
  calcFresnel();
  if (matchedRow) {
    calcTxPower();
    deviceinfo();
  }
});
