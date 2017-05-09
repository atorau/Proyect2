class APIHandler {
  constructor (baseUrl) {
    this.BASE_URL = baseUrl;
  }

  displayTrack(route_id,map) {
    $.ajax({
      url: this.BASE_URL+"/"+route_id+"/trackname",
      method: "GET",
      success: function (response) {
        console.log("hi2",response);
        let filename =  "../.."+response;
        console.log("filename",filename);
        loadGPXFileIntoGoogleMap(map, filename);
      },
      error: function (err) {
        console.log(err);
        return;
      },
    });
  }
}

function loadGPXFileIntoGoogleMap(map, filename) {
  $.ajax({
    url: filename,
    dataType: "xml",
    success: function(data) {
      var parser = new GPXParser(data, map);
      parser.setTrackColour("#ff0000"); // Set the track line colour
      parser.setTrackWidth(5); // Set the track line width
      parser.setMinTrackPointDelta(0.001); // Set the minimum distance between track points
      parser.centerAndZoom(data);
      parser.addTrackpointsToMap(); // Add the trackpoints
      parser.addRoutepointsToMap(); // Add the routepoints
      parser.addWaypointsToMap(); // Add the waypoints
    }
  });
}
