const routeAPI = new APIHandler("http://localhost:3000/apiRoutes");

$(document).ready(function() {
  var mapOptions = {
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  var map = new google.maps.Map(document.getElementById("map"),
    mapOptions);
  var route_id = $('.track-route').attr("route-id");
  routeAPI.displayTrack(route_id,map);
});
