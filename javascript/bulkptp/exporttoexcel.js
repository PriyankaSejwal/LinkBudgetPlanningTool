function downloadExport() {
  var saveoption = $("#reportExport").val();
  if (saveoption == "excel") {
    exportToExcel();
  }
}

function exportToExcel() {
  var dataarray = [];
  //   Get the headers from the datatable
  var headers = [];
  $("#datatable th").each(function () {
    headers.push($(this).text());
  });
  dataarray.push(headers);
  $("#datatable tr").each(function () {
    var rowData = [];
    $(this)
      .find("td")
      .each(function () {
        rowData.push($(this).text());
      });
    // push the rowData into the dataArray
    dataarray.push(rowData);
  });
  console.log(dataarray);
  csvContent = "data:text/csv;charset=utf-8,\uFEFF";
  dataarray.forEach(function (rowdata) {
    row = rowdata.join(",");
    csvContent += row + "\r\n";
  });
  /* create a hidden <a> DOM node and set its download attribute */
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "PTP_Report.csv");
  document.body.appendChild(link);
  /* download the data file named "PTP_Report.csv" */
  link.click();
  // Removing the created child a in the body.
  document.body.removeChild(link);
}
