// this file contains the code reated to new radio addition

// when plus button is clicked the form for the new radio opens and the parameter container hides
$("#openNewRadioForm").click(function () {
  //STEP 1: hiding the main container
  $("#ptp-container").hide();
  //STEP 2: create the dropwdown menu for the radio family that are available with us already.
  availableRadioFamilies();
  // STEP 3: displaying the form for the new radio
  $("#newRadioForm").show();
  // STEP 4:  disable the country selection section
  $("#ptpctrySection").addClass("deselected");
});

//
//
// the list of already exisitng radio families and dropdown menu to choose the radio family on the basisi of the list
var radioFamilyClassName = [];
var radioArray = [];
function availableRadioFamilies() {
  // empty the radioArray
  radioArray.length = 0;
  $("#radio1 option").each(function () {
    // Array of all the radios already in the dropdown
    radioArray.push($(this).text());
    // classname of the radios indicating the radio family of the radios.
    if (!radioFamilyClassName.includes($(this).attr("class"))) {
      radioFamilyClassName.push($(this).attr("class"));
    }
  });
  // create the dropdown menu for the new radio family
  // container where the dropdown is to be added
  var selectContainer = $("#radioFamilyForNewRadio");

  // options in the select dropdown for the exisitng families additionaly one extra for new family, if needed
  $.each(radioFamilyClassName, function (index, element) {
    $("<option>", { text: element, id: element + "-family" }).appendTo(
      selectContainer
    );
  });
  // one more option for other radio if the user wants to add a new family
  $("<option>", { text: "New Radio Family", id: "customRadioFamily" }).appendTo(
    selectContainer
  );
}

// when the radio family is selected from the dropdwon
$("#radioFamilyForNewRadio").change(function () {
  var radioFamily = $(this).val();
  console.log("the ubr family selected is: ", radioFamily);
  if (radioFamily == "New Radio Family") {
    $("#radioFamilyName").val(" ");
    // new-radio-input class is added to check for non-empty validation
    $("#radioFamilyName").addClass("new-radio-input");
    // show the field to enter the name for the new family
    $("#newRadioCustomFamilyContainer").show();
    // show the mcs table option
    $(".mcsContainerForNewRadio").show();
    /* apply the class to the mcs dropdown whihc can help in checking whether the mcs value has been opted
    this wll allow us to check for the non empty value as new-radio-input class is defined to check the non-empty 
    validation*/
    $("#maxMcs").addClass("new-radio-input");
  } else {
    // hide the mcs table option
    $(".mcsContainerForNewRadio").hide();
    /* removing the class new-radio-input from the mcs dropdown menu when the mcs table is not in use*/
    $("#maxMcs").removeClass("new-radio-input");
    // show the field to enter the name for the new family
    $("#newRadioCustomFamilyContainer").hide();
    $("#radioFamilyName").val(radioFamily);
  }
});

/* when radio family name is entered by the user, check from the radio family
 name dropdown option whether the family name already exists */
$("#radioFamilyName").change(function () {
  var radioFamilyName = $(this).val();
  console.log(radioFamilyClassName);
  if (radioFamilyClassName.includes(radioFamilyName)) {
    console.log("The radio family exists in abive dropdown");
    $(".familyNameAlert").show();
  } else {
    console.log("The radio family is unique,");
    $(".familyNameAlert").hide();
  }
});

// when radio Name is entered, check whether the radio name already exists
$("#radioName").on("change", function () {
  var radioname = $(this).val();
  // checking if the new radio name already exists in the tool
  if (radioArray.includes(radioname)) {
    $(".invalidNameAlert").show();
  } else {
    $(".invalidNameAlert").hide();
  }
});

// when mcs data is entered
$("#maxMcs").on("change", function () {
  var maxmcsvalue = parseInt($(this).val());
  // function called for creating tables
  tabletillmcs9(maxmcsvalue);
});

// close button in the new radio form to close the form even without entering the data
$("#closeNewRadioForm").click(function () {
  $("#newRadioForm").hide();
  $("#ptp-container").show();
  //   enable the country selection section
  $("#ptpctrySection").removeClass("deselected");
  // hiding the alert which might have occured due to wrong entries of the radio name, gain or power
  $(".emptyAlert").hide();
  $(".invalidNameAlert").hide();
  $(".invalidValueAlert").hide();
  // empty the dropdown menu which has the list of radio families
  $("#radioFamilyForNewRadio").html("");
});

// button in the new radio form which submits the details of the new radio and also hides the new radio form
// and brings the defualt container for parameters back
$("#submitNewRadioDetails").click(function () {
  //values that were entered by the user
  const radioFamilyDropdown = $("#radioFamilyForNewRadio").val();
  const radioFamilyInputField = $("#radioFamilyName").val().trim();
  const radioFamilyName =
    radioFamilyInputField !== undefined
      ? radioFamilyInputField
      : radioFamilyDropdown;
  // window.alert(
  //   radioFamilyInputField,
  //   " is the family for the new radio to be added"
  // );
  const radioName = $("#radioName").val();
  const radioGain = $("#radioGain").val();
  const radioPower = $("#radioPower").val();
  const maxmcs = $("#maxMcs").val();
  var isValid = true;

  $(".new-radio-input").each(function () {
    if ($(this).val() === "" || $(this).val() === null) {
      isValid = false;
      return false;
    }
  });

  if (isValid) {
    $(".emptyAlert").hide();
    //   function called to add new radio
    addRadioToList(radioFamilyName, radioName, radioGain, radioPower);
    // function to add the tables created to the table-container
    if (radioFamilyDropdown === "New Radio Family") {
      createNewTable(radioName);
    }

    // after creating new table and adding the radio to the drodwon we close the form of the new radio
    // and display the ptp-container
    // reset the from
    $("#newRadioForm").hide();
    $("#ptp-container").show();
    //   enable the country selection section
    $("#ptpctrySection").removeClass("deselected");
    // emptying the div container  for the tables of mcs
    $(".newRadioTableContainer").html("");
    // removing all the options of the dropdown of the radio families.
    $("#radioFamilyForNewRadio option:not(:first)").remove();
    // select the fist option after deleting the otions from second onwards
    $("#radioFamilyForNewRadio").prop("selectedIndex", 0);
    // reset the form
    $("#newRadioDetailForm").trigger("reset");
  } else {
    $(".emptyAlert").show();
  }
});

// adding the new radio option to the exisitng radio list
function addRadioToList(newRadioFamily, radioName, radioGain, radioPower) {
  console.log(radioName, radioGain, radioPower);
  var optGroupLabel = "Custom Radio";
  var optGroup = $(`#radio1`).find(`optgroup[label="` + optGroupLabel + `"]`);
  // checking if the custom radio option group is already present based on that if else is used
  if (optGroup.length > 0) {
    for (let i = 1; i <= 2; i++) {
      $(`#radio${i} optgroup[label="` + optGroupLabel + `"]`).append(
        $("<option>", {
          value: radioGain + "," + radioPower,
          text: radioName,
          class: newRadioFamily,
        })
      );
    }
  } else {
    // updating the radio list with new radio data
    for (let i = 1; i <= 2; i++) {
      $(`#radio${i}`).append(
        $("<optgroup>", { label: "Custom Radio", class: "optGroup" }).append(
          $("<option>", {
            value: radioGain + ", " + radioPower,
            text: radioName,
            class: newRadioFamily,
          })
        )
      );
    }
  }
  // close the container where we fill in the new radio detail
  // $("#newRadioForm").hide();
}

// function which will generate the tables based on the mcs value
// will not get called if radio family selected from the dropdown already exists
function tabletillmcs9(n) {
  console.log("MCS changed functionread");
  var form = $("#newRadioDetailForm");
  const headerArray = [
    "Sensitivity",
    "SNR",
    "MCS",
    "Modulation",
    "FEC",
    "Link Rate",
    "Thoughput",
    "Tx Power",
  ];
  var headerarrayLength = headerArray.length;
  const mcsArray = getMCSArray(n);
  console.log(mcsArray);
  const bandwidthnames = [20, 40, 80];
  // radio name given to the newly added radio
  var radioname = $("#radioName").val();
  var newtablediv = $(".newRadioTableContainer");
  // creating the table
  for (let i = 1; i <= 3; i++) {
    // making container with class row and other container with class col-12 and sidebar-padding
    var rowdiv = $("<div>", { class: "row" });
    var coldiv = $("<div>", { class: "col-12 sidebar-padding" });
    var label = $("<label>", {
      class: "label",
      text: "Channel Width " + bandwidthnames[i - 1],
    });
    var table = $("<table>", {
      id: radioname + bandwidthnames[i - 1],
      class: "table table-striped table-condensed newRadioTable",
    });
    for (let j = 0; j <= n + 1; j++) {
      var row = $("<tr>").appendTo(table);
      for (let k = 1; k <= headerarrayLength; k++) {
        var cell = $("<td>");
        if (j == 0) {
          cell.text(headerArray[k - 1]);
          if (k == 2 || k == 4 || k == 5 || k == 6) {
            cell.hide();
          }
        } else {
          if (k == 1 || k == 7 || k == 8) {
            const inputField = $("<input>", {
              type: "text",
              class: "input new-radio-input",
              id: bandwidthnames[i - 1] + `input${j}${k}`,
              value: mcsArray[i - 1][j - 1][k - 1],
            });
            // event listener attached
            inputField.on("change", function (event) {
              validateMinRSL(event, j, k);
            });
            cell.append(inputField);
          } else if (k >= 2 && k <= 6) {
            const dataValue = mcsArray[i - 1][j - 1][k - 1];
            cell.text(dataValue);
            if (k == 2 || k == 4 || k == 5 || k == 6) {
              cell.hide();
            }
          }
        }
        row.append(cell);
      }
    }
    coldiv.append(label, table);
    rowdiv.append(coldiv);
    newtablediv.append(rowdiv);
  }
}

// function which will check the min rsl entered and based on the value entered it will fill in the max rsl for the
// row just above the current
function handleInput(event, j, k) {
  if (j > 1) {
    var val = parseInt($(event.target).val());
    if (k == 1) {
      var currenttd = $(event.target).closest("td");
      var previousRow = currenttd.closest("tr").prev();
      var previousTd = previousRow.find("td").eq(currenttd.index() + 1);
      var prevTrsameTdVal = previousRow
        .find("td")
        .eq(currenttd.index())
        .find("input")
        .val();
      console.log(val, prevTrsameTdVal);
      if (parseInt(prevTrsameTdVal) < val) {
        previousTd.text(val + 0.01);
      } else {
        window.alert("Current Value must be greater than the previous value");
      }
    }
  }
}

// adding table to the table container
function createNewTable(radioname) {
  // container where new radio container is to be stored
  var tablecontainer = $(".table-container");
  var radioFamilyName = $("#radioFamilyName").val().trim();
  var bandwidthTable = ["20MHz", "40MHz", "80MHz"];
  var newtablecontainer = $("<div>", { class: radioFamilyName + `-table` });
  const headerArray = [
    "Sensitivity",
    "SNR",
    "MCS",
    "Modulation",
    "FEC",
    "Link Rate",
    "Throughput",
    "Tx Power",
  ];
  const firstRow = ["-150", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"];
  const lastRow = ["0", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"];
  var tableForLocalStorage = [];
  $(".newRadioTable").each(function (index) {
    console.log(index);
    // array where data for each table 10, 20, 40 80 will be stored for further work
    var tabledataArray = [];
    // find all tr except first one which contains headers gt means greater than
    $(this)
      .find("tr:gt(0)")
      .each(function () {
        var rowData = [];
        $(this)
          .find("td")
          .each(function () {
            var input = $(this).find("input");
            var cellValue;
            if (input.length) {
              cellValue = input.val();
            } else {
              cellValue = $(this).text();
            }
            rowData.push(cellValue);
          });
        tabledataArray.push(rowData);
      });

    // first second and last row of the tabledataArray to be headers, N/A
    tabledataArray.push(lastRow);
    tabledataArray.unshift(firstRow);
    tabledataArray.unshift(headerArray);
    console.log(tabledataArray);
    tableForLocalStorage.push(tabledataArray);

    // create new table for 20,40 80 bandwidths of new radio
    var newTable = $("<table>", {
      id: radioFamilyName + "-table-" + bandwidthTable[index],
    });
    $.each(tabledataArray, function (arrayindex, arrayrow) {
      var tr = $("<tr>");
      $.each(arrayrow, function (arrayindex, arrayvalue) {
        var td = $("<td>").text(arrayvalue);
        tr.append(td);
      });
      newTable.append(tr);
    });
    newtablecontainer.append(newTable);
  });
  // add the tableForLocalStorage in the local storage
  localStorage.setItem(
    `${radioname}-table`,
    JSON.stringify(tableForLocalStorage)
  );
  // add the newly created container of tables to the main table container in the code
  tablecontainer.append(newtablecontainer);
}

// function to give the mcs array based on the max mcs selected 9 or 11
function getMCSArray(n) {
  var mcsDataArray;
  // switch statement
  switch (n) {
    case 9:
      mcsDataArray = [
        [
          ["-85", "2", "0", "BPSK", "1/2", "14.4", "10", "24"],
          ["-83", "5", "1", "QPSK", "1/2", "28.9", "20", "24"],
          ["-80", "9", "2", "QPSK", "3/4", "43.3", "30", "22"],
          ["-79", "11", "3", "16-QAM", "1/2", "57.8", "40", "22"],
          ["-77", "15", "4", "16-QAM", "3/4", "86.7", "60", "20"],
          ["-75", "18", "5", "64-QAM", "2/3", "115.6", "80", "20"],
          ["-73", "20", "6", "64-QAM", "3/4", "130", "91", "19"],
          ["-70", "25", "7", "64-QAM", "5/6", "144.4", "101", "19"],
          ["-68", "29", "8", "256-QAM", "3/4", "173.3", "120", "17"],
          ["-63", "31", "9", "256-QAM", "5/6", "192", "135", "17"],
        ],
        [
          ["-84", "2", "0", "BPSK", "1/2", "30", "21", "24"],
          ["-82", "5", "1", "QPSK", "1/2", "60", "42", "24"],
          ["-79", "9", "2", "QPSK", "3/4", "90", "63", "22"],
          ["-78", "11", "3", "16-QAM", "1/2", "120", "84", "22"],
          ["-74", "15", "4", "16-QAM", "3/4", "180", "126", "20"],
          ["-73", "18", "5", "64-QAM", "2/3", "240", "168", "20"],
          ["-70", "20", "6", "64-QAM", "3/4", "270", "189", "19"],
          ["-67", "25", "7", "64-QAM", "5/6", "300", "210", "19"],
          ["-65", "29", "8", "256-QAM", "3/4", "360", "252", "17"],
          ["-61", "31", "9", "256-QAM", "5/6", "400", "280", "17"],
        ],
        [
          ["-83", "2", "0", "BPSK", "1/2", "65", "45", "24"],
          ["-80", "5", "1", "QPSK", "1/2", "130", "91", "24"],
          ["-76", "9", "2", "QPSK", "3/4", "195", "136", "22"],
          ["-74", "11", "3", "16-QAM", "1/2", "260", "182", "22"],
          ["-72", "15", "4", "16-QAM", "3/4", "390", "273", "20"],
          ["-70", "18", "5", "64-QAM", "2/3", "520", "364", "20"],
          ["-68", "20", "6", "64-QAM", "3/4", "585", "410", "19"],
          ["-63", "25", "7", "64-QAM", "5/6", "650", "455", "19"],
          ["-61", "29", "8", "256-QAM", "3/4", "780", "546", "17"],
          ["-55", "31", "9", "256-QAM", "5/6", "866.7", "610", "17"],
        ],
      ];
      break;
    case 11:
      mcsDataArray = [
        [
          ["-85", "5", "0", "BPSK", "1/2", "17.2", "12", "26"],
          ["-83", "7.5", "1", "QPSK", "1/2", "34.4", "24", "26"],
          ["-80", "10", "2", "QPSK", "3/4", "51.6", "36.1", "25"],
          ["-79", "12.5", "3", "16-QAM", "1/2", "68.8", "48.2", "25"],
          ["-77", "15", "4", "16-QAM", "3/4", "103.2", "72.2", "24"],
          ["-75", "17.5", "5", "64-QAM", "2/3", "137.2", "96.3", "24"],
          ["-73", "20", "6", "64-QAM", "3/4", "154.9", "108.4", "23"],
          ["-70", "22.5", "7", "64-QAM", "5/6", "172.1", "120.5", "22"],
          ["-68", "25", "8", "256-QAM", "3/4", "206.5", "144.5", "21"],
          ["-63", "27.5", "9", "256-QAM", "5/6", "229.4", "160.7", "20"],
          ["-59", "30", "10", "1024-QAM", "3/4", "258.1", "180.7", "19"],
          ["-57", "32.5", "11", "1024-QAM", "5/6", "286.8", "200.8", "19"],
        ],
        [
          ["-84", "5", "0", "BPSK", "1/2", "34.4", "24.1", "26"],
          ["-82", "7.5", "1", "QPSK", "1/2", "68.8", "48.2", "26"],
          ["-79", "10", "2", "QPSK", "3/4", "103.2", "72.2", "25"],
          ["-78", "12.5", "3", "16-QAM", "1/2", "137.6", "96.32", "25"],
          ["-74", "15", "4", "16-QAM", "3/4", "206.5", "144.55", "24"],
          ["-73", "17.5", "5", "64-QAM", "2/3", "275.3", "192.71", "24"],
          ["-70", "20", "6", "64-QAM", "3/4", "309.7", "216.79", "23"],
          ["-67", "22.5", "7", "64-QAM", "5/6", "344.1", "240.87", "22"],
          ["-65", "25", "8", "256-QAM", "3/4", "412.9", "289.03", "21"],
          ["-61", "27.5", "9", "256-QAM", "5/6", "458.8", "321.16", "20"],
          ["-57", "30", "10", "1024-QAM", "3/4", "516.2", "361.34", "19"],
          ["-55", "32.5", "11", "1024-QAM", "5/6", "573.5", "401.45", "19"],
        ],
        [
          ["-83", "5", "0", "BPSK", "1/2", "72.1", "50.47", "26"],
          ["-80", "7.5", "1", "QPSK", "1/2", "144.1", "100.87", "26"],
          ["-76", "10", "2", "QPSK", "3/4", "216.2", "151.4", "25"],
          ["-74", "12.5", "3", "16-QAM", "1/2", "288.2", "201.74", "25"],
          ["-72", "15", "4", "16-QAM", "3/4", "432.4", "302.4", "24"],
          ["-70", "17.5", "5", "64-QAM", "2/3", "576.5", "403.5", "24"],
          ["-68", "20", "6", "64-QAM", "3/4", "648.5", "453.95", "23"],
          ["-63", "22.5", "7", "64-QAM", "5/6", "720.6", "504.4", "22"],
          ["-61", "25", "8", "256-QAM", "3/4", "864.7", "605.29", "21"],
          ["-55", "27.5", "9", "256-QAM", "5/6", "960.8", "672.56", "20"],
          ["-51", "30", "10", "1024-QAM", "3/4", "1080.9", "756.63", "19"],
          ["-50", "32.5", "11", "1024-QAM", "5/6", "1201", "840.7", "19"],
        ],
      ];
      break;
  }
  console.log(mcsDataArray);
  return mcsDataArray;
}
