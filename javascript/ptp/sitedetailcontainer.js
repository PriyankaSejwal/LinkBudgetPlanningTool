$("#openAddressFields").change(function (event) {
  if (event.target.checked) {
    $("#address-container").show();
    $("#latlng-container").hide();
    event.target.checked = false;
  }
});

$("#openLatLongFields").change(function (event) {
  if (event.target.checked) {
    $("#latlng-container").show();
    $("#address-container").hide();
    event.target.checked = false;
  }
});
