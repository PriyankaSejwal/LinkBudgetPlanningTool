// function which were called when the bandwidth or the frequency is changed

$("#ptpchannelBandwidth").change(function () {
  checkBandwidth();
  ptpeirpcalculate();
  mcsrefer();
});

$("#ptpchannelFrequency").change(function () {
  checkBandwidth();
  ptpeirpcalculate();
  calcFresnel();
  mcsrefer();
});
