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
 name dropdown option whther the family name already exists */
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
});

// button in the new radio form which submits the details of the new radio and also hides the new radio form
// and brings the defualt container for parameters back
$("#submitNewRadioDetails").click(function () {
  //values that were entered by the user
  const radioFamilyDropdown = $("#radioFamilyForNewRadio").val();
  const radioFamilyInputField = $("#radioFamilyName").val();
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
    $("#newRadioForm").trigger("reset");
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
    "MCS",
    "Modulation",
    "FEC",
    "Link Rate",
    "Thoughput",
    "Tx Power",
  ];
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
      text: "Table for " + bandwidthnames[i - 1],
    });
    var table = $("<table>", {
      id: radioname + bandwidthnames[i - 1],
      class: "table table-striped table-condensed newRadioTable",
    });
    for (let j = 0; j <= n + 1; j++) {
      var row = $("<tr>").appendTo(table);
      for (let k = 1; k <= 7; k++) {
        var cell = $("<td>");
        if (j == 0) {
          cell.text(headerArray[k - 1]);
        } else {
          if (k == 1 || k == 6 || k == 7) {
            const inputField = $("<input>", {
              type: "text",
              class: "input new-radio-input",
              id: bandwidthnames[i - 1] + `input${j}${k}`,
            });
            // event listener attached
            inputField.on("change", function (event) {
              validateMinRSL(event, j, k);
            });
            cell.append(inputField);
          } else if (k >= 2 && k <= 6) {
            const dataValue = mcsArray[i - 1][j - 1][k - 2];
            cell.text(dataValue);
          }
        }
        // if (k == 2 || k == 6) {
        //   cell.hide();
        // }
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
  var radioFamilyName = $("#radioFamilyName").val();
  var bandwidthTable = ["20MHz", "40MHz", "80MHz"];
  var newtablecontainer = $("<div>", { class: radioFamilyName + `-table` });
  const headerArray = [
    "Sensitivity",
    "MCS",
    "Modulation",
    "FEC",
    "Link Rate",
    "Throughput",
    "Tx Power",
  ];
  const firstRow = ["-150", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"];
  const lastRow = ["0", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"];
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
          ["0", "BPSK", "1/2", "14.4"],
          ["1", "QPSK", "1/2", "28.9"],
          ["2", "QPSK", "3/4", "43.3"],
          ["3", "16-QAM", "1/2", "57.8"],
          ["4", "16-QAM", "3/4", "86.7"],
          ["5", "64-QAM", "2/3", "115.6"],
          ["6", "64-QAM", "3/4", "130"],
          ["7", "64-QAM", "5/6", "144.4"],
          ["8", "256-QAM", "3/4", "173.3"],
          ["9", "256-QAM", "5/6", "192"],
        ],
        [
          ["0", "BPSK", "1/2", "30"],
          ["1", "QPSK", "1/2", "60"],
          ["2", "QPSK", "3/4", "90"],
          ["3", "16-QAM", "1/2", "120"],
          ["4", "16-QAM", "3/4", "180"],
          ["5", "64-QAM", "2/3", "240"],
          ["6", "64-QAM", "3/4", "270"],
          ["7", "64-QAM", "5/6", "300"],
          ["8", "256-QAM", "3/4", "360"],
          ["9", "256-QAM", "5/6", "400"],
        ],
        [
          ["0", "BPSK", "1/2", "65"],
          ["1", "QPSK", "1/2", "130"],
          ["2", "QPSK", "3/4", "195"],
          ["3", "16-QAM", "1/2", "260"],
          ["4", "16-QAM", "3/4", "390"],
          ["5", "64-QAM", "2/3", "520"],
          ["6", "64-QAM", "3/4", "585"],
          ["7", "64-QAM", "5/6", "650"],
          ["8", "256-QAM", "3/4", "780"],
          ["9", "256-QAM", "5/6", "866.7"],
        ],
      ];
      break;
    case 11:
      mcsDataArray = [
        [
          ["0", "BPSK", "1/2", "17.2"],
          ["1", "QPSK", "1/2", "34.4"],
          ["2", "QPSK", "3/4", "51.6"],
          ["3", "16-QAM", "1/2", "68.8"],
          ["4", "16-QAM", "3/4", "103.2"],
          ["5", "64-QAM", "2/3", "137.2"],
          ["6", "64-QAM", "3/4", "154.9"],
          ["7", "64-QAM", "5/6", "172.1"],
          ["8", "256-QAM", "3/4", "206.5"],
          ["9", "256-QAM", "5/6", "229.4"],
          ["10", "1024-QAM", "3/4", "258.1"],
          ["11", "1024-QAM", "5/6", "286.8"],
        ],
        [
          ["0", "BPSK", "1/2", "34.4"],
          ["1", "QPSK", "1/2", "68.8"],
          ["2", "QPSK", "3/4", "103.2"],
          ["3", "16-QAM", "1/2", "137.6"],
          ["4", "16-QAM", "3/4", "206.5"],
          ["5", "64-QAM", "2/3", "275.3"],
          ["6", "64-QAM", "3/4", "309.7"],
          ["7", "64-QAM", "5/6", "344.1"],
          ["8", "256-QAM", "3/4", "412.9"],
          ["9", "256-QAM", "5/6", "458.8"],
          ["10", "1024-QAM", "3/4", "516.2"],
          ["11", "1024-QAM", "5/6", "573.5"],
        ],
        [
          ["0", "BPSK", "1/2", "72.1"],
          ["1", "QPSK", "1/2", "144.1"],
          ["2", "QPSK", "3/4", "216.2"],
          ["3", "16-QAM", "1/2", "288.2"],
          ["4", "16-QAM", "3/4", "432.4"],
          ["5", "64-QAM", "2/3", "576.5"],
          ["6", "64-QAM", "3/4", "648.5"],
          ["7", "64-QAM", "5/6", "720.6"],
          ["8", "256-QAM", "3/4", "864.7"],
          ["9", "256-QAM", "5/6", "960.8"],
          ["10", "1024-QAM", "3/4", "1080.9"],
          ["11", "1024-QAM", "5/6", "1201"],
        ],
      ];
      break;
  }
  console.log(mcsDataArray);
  return mcsDataArray;
}
