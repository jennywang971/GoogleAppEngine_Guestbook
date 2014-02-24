"use strict";

/*
 * Reference:
 * https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
 * https://developers.google.com/maps/documentation/javascript/markers
 * http://www.w3.org/TR/geolocation-API/
 */

var map;
var markers = [];

var options = {
		enableHighAccuracy : true,
		timeout : 5000,
		maximumAge : 0
};

google.maps.visualRefresh = true;

function initialize() {
	var mapOptions = {
		zoom: 12 
	};
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	setMarkers(map);

	// show position when geolocation is supported and succeeded
	function showPosition(position) {
		var map_position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		var infowindow = new google.maps.InfoWindow({
			map: map,
			position: map_position,
			content: 'Your current location. Powered by HTML5.'
		});

//		now we can set the map with current position
		map.setCenter(map_position);

//		set current Latitude and Longitude for guestbook entry
		document.getElementById("latitude").value = position.coords.latitude;
		document.getElementById("longitude").value = position.coords.longitude;
		document.getElementById("accuracy").value = position.coords.accuracy;
	}

	// if no geolocation is available, display reason and a default map
	function handleNoGeolocation(isSupported) {
		
		var content = isSupported ? 'Error: The geolocation service failed' : 'Your browser doesn\'t support geolocation.';

		var options = {
			map : map,
			position : new google.maps.LatLng(60, 105), 
			content : content
		};

		var infowindow = new google.maps.InfoWindow(options);

		map.setCenter(options.position);

//		no need to set Latitude and Longitude for guestbook entry
	}

	// use HTML5 geolocation
	if (navigator.geolocation) {

		// specify the geolocation success and error callback functions
		// HTML5: navigator.geolocation.getCurrentPosition(success, error, options)
		navigator.geolocation.getCurrentPosition(showPosition, function() {handleNoGeolocation(true);});

	} else {
		handleNoGeolocation(false);
	}
}

function addMarker(location, title) {

	var marker = new google.maps.Marker({
		map : map,
		position : location,
		draggable : true,
		animation : google.maps.Animation.DROP,
		title : title
	});

	markers.push(marker);
}

function setMarkers(map) {
	for (var i = 0, j = markers.length; i < j; i++)
		markers[i].setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);