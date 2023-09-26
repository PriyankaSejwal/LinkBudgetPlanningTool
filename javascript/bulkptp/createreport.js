/*this is the javascript file in which we create containers to store the link simulation for the number
of pairs of coordinates in imported excel file*/

$("#importptpreportbtn").click(function () {
  $(".popup").show();
  $(".container-fluid").hide();
});

$("#close-btn").click(function () {
  $(".popup").hide();
  $(".container-fluid").show();
});

function createnewcontainers(i) {
  // creating new container for the report which contains header and table for the calculation
  $("<div>", { class: "heading", html: `Link${i}` }).appendTo(
    $("<div>", {
      class: "report-content",
      id: `link${i}report-content`,
    }).appendTo(
      $("<div>", { class: "col-lg-6 report-holder" }).appendTo(
        $("<div>", { class: "row", id: `link${i}row` }).appendTo(
          $(".modal-body")
        )
      )
    )
  );
  // table of calculation
  var table = $("<table>", {
    class: "table table-condensed table-striped",
    id: `link${i}Table`,
  });
  var tbody = $("<tbody>");
  // appending table to the container in which we appended the heading
  table.appendTo($(`#link${i}report-content`));
  tbody.appendTo($(`#link${i}Table`));

  // appending the table with the rows and the cells
  var labelarray = [
    "Latitude",
    "Longitude",
    "Bandwidth",
    "Channel Frequency",
    "Height",
    "Radio",
    "Gain",
    "Max EIRP",
    "Transmit Power",
    "Hop Distance",
    "Azimuth",
    "Fresnel Radius",
    "RSL",
    "SNR",
    "Fade Margin",
    "MCS",
    "Modulation",
    "FEC",
    "Link Rate",
    "Throughput",
    "Availability",
  ];
  var idarray = [
    "Latitude",
    "Longitude",
    "Bandwidth",
    "ChannelFrequency",
    "Height",
    "Radio",
    "Gain",
    "MaxEIRP",
    "TransmitPower",
    "HopDistance",
    "Azimuth",
    "FresnelRadius",
    "RSL",
    "SNR",
    "FadeMargin",
    "MCS",
    "Modulation",
    "FEC",
    "LinkRate",
    "Throughput",
    "Availability",
  ];
  var unitarray = [
    " ",
    " ",
    "MHz",
    " MHz",
    " m",
    " ",
    " dBi",
    " ",
    " dBm",
    " Km",
    " °",
    " m",
    " dBm",
    " dB",
    " dB",
    " ",
    " ",
    " ",
    " Mbps",
    "Mbps",
    " %",
  ];

  // iterating over the array length to add rows to the table created
  for (let k = 1; k <= labelarray.length + 1; k++) {
    if (k == 1) {
      // three headers in the first row of the table one header empty other two for "Site A" and "Site B"
      $("<th>", { html: "" }).appendTo($("<tr>").appendTo($(`#link${i}Table`)));
      $("<th>", { html: "Site A" }).appendTo(
        $(`#link${i}Table tr:nth-child(${k})`)
      );
      $("<th>", { html: "Site B" }).appendTo(
        $(`#link${i}Table tr:nth-child(${k})`)
      );
    } else {
      $("<th>", { html: labelarray[k - 2] }).appendTo(
        $("<tr>").appendTo(`#link${i}Table`)
      );
      for (let j = 1; j <= 2; j++) {
        // span for the calculated value
        $("<span>", { id: `link${i}` + idarray[k - 2] + j }).appendTo(
          $("<td>").appendTo($(`#link${i}Table tr:nth-child(${k})`))
        );
        // another span for unit
        $("<span>", { html: unitarray[k - 2] }).appendTo(
          `#link${i}Table tr:nth-child(${k}) td:nth-of-type(${j + 1})`
        );
      }
    }
  }
}
