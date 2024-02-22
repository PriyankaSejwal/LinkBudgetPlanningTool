var antennaGainObject = {
  ion4l1_BTS: {
    0: 16,
    10: 15,
    20: 14,
    30: 13,
    40: 12,
    45: 3,
    46: 0,
    315: 3,
    319: 3,
    330: 12,
    339: 13,
    349: 14,
    359: 15,
    360: 16,
  },
  ion4l2_BTS: {
    0: 19,
    10: 18,
    20: 17,
    25: 16,
    30: 4,
    36: 0,
    330: 4,
    334: 4,
    339: 16,
    349: 17,
    359: 18,
    360: 19,
  },
};

function getGainForSlaveBasedOnAngle(masterRadio, slaveAngle) {
  var gainObject = antennaGainObject[masterRadio];
  for (const angle in gainObject) {
    if (slaveAngle <= parseInt(angle)) {
      return gainObject[angle];
      break;
    }
  }
}
