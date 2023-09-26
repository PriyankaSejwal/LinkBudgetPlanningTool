var importptpmap, bounds;

function initMap() {
  var options = { center: { lat: 28.7041, lng: 77.1025 }, zoom: 2 };
  //   New map for import ptp page
  importptpmap = new google.maps.Map(
    document.getElementById("importptpmap"),
    options
  );

  bounds = new google.maps.LatLngBounds();

  // Add a click event listener to the map
  google.maps.event.addListener(importptpmap, "click", function (event) {
    // Get the coordinates where the user clicked
    var clickedLatLng = event.latLng;

    // Set the map's center to the clicked location and zoom in
    importptpmap.setCenter(clickedLatLng);
    importptpmap.setZoom(10); // Adjust the zoom level as needed
  });
}
