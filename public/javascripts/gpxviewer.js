// const routeAPI = new APIHandler("http://localhost:3000/apiRoutes");
const routeAPI = new APIHandler("http://mountainandcomedy.herokuapp.com/apiRoutes");

$(document).ready(function() {
  var mapOptions = {
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
  var map = new google.maps.Map(document.getElementById("map"),
    mapOptions);
  var route_id = $('.track-route').attr("route-id");
  console.log("yeloooooooo∫")
  routeAPI.displayTrack(route_id,map);
});
