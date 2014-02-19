"use strict";
var map;
var markers = [];

function initialize() {
    var mapOptions = {
      zoom: 8
    };
    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    
    // use HTML5 geolocation
    if(navigator.geolocation){
  	
  	// specify the geolocation success and error callback functions
  	// HTML5: navigator.geolocation.getCurrentPosition(success, error, options)
    	navigator.geolocation.getCurrentPosition(showPosition, handleNoGeolocation(true));
    }
    else{
  	  handleNoGeolocation(false);
    }

  // show position when geolocation is supported and succeeded
  function showPosition(position){
	  var map_position = new google.maps.LatLng(position.coords.latitude,
			  position.coords.longitude);
	  
	  var infowindow = new google.maps.InfoWindow({
	        map: map,
	        position: map_position,
	        content: 'Your current location. Powered by HTML5.'
	      });
	  
	  var marker = new google.maps.Marker({
		    position: map_position,
		    map: map
		  });
	  
	  // now we can set the map with current position
	  map.setCenter(map_position);
	  
	  // set current Latitude and Longitude for guestbook entry
	  document.getElementById("latitude").value =  position.coords.latitude; 
	  document.getElementById("longitude").value = position.coords.longitude;
	  document.getElementById("accuracy").value = position.coords.accuracy;
  }
  
  // if no geolocation is available, display reason and a default map
  function handleNoGeolocation(isSupported){
	  if(isSupported){
		  var content = 'Error: The Geolocation service failed';
	  }
	  else{
		  var content = 'Your browser doesn\'t support geolocation.';
	  }

	var options = {
			map : map,
			position : new google.maps.LatLng(60, 105), // shows map at a default location
			content : content
		};
	
	var infowindow = new google.maps.InfoWindow(options);
	
	map.setCenter(options.positions);
	
	// no need to set Latitude and Longitude for guestbook entry
	}
  }

function addMarker(latitude, longitude, title){
	var marker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(latitude, longitude),
		title: title
});
	marker.setMap(map);
	alert(title+latitude+longitude);
	//markers.push(marker);
}
//
//function setAllMap(map) {
//	for (var i = 0; i < markers.length; i++) {
//	markers[i].setMap(map);
//	}
//} 
	
google.maps.event.addDomListener(window,'load', initialize);