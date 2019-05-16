//Global Variables
var mymap;
var latitude;
var longtitude;
var request;

//initially called to load a map of NZ
function loadMap() {
	mymap = L.map('mapid').setView([-43.9674, 170.489395], 4);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> 	contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    	maxZoom: 18,
    	id: 'mapbox.streets',
  	accessToken: 'pk.eyJ1IjoicmVlY2VicmVlYmFhcnQiLCJhIjoiY2p2YnM5eHY5MXFtZTQzb2prcHp5Nmx3byJ9.JpSFphAPYYEZ-wlYnvjtZg'
	}).addTo(mymap);
}
window.onload = loadMap;

//this function reads input from the text box
function searchLocation() {
	//get user input
	var searchTerm = document.getElementById("location_input").value;
	//call function to locate the town
	findLocation(searchTerm);
}

//this function makes a fetch call to mapquest to geolocate the input
function findLocation(location) {
		//fetch location from mapquest
		fetch("https://www.mapquestapi.com/geocoding/v1/address?key=mqN5cxd0J5g8N3QBj6v8iaa18DjGwhel&location="+location)
		//parse json response 
		.then(response => response.json())
		.then(json => displayMap(json));
}

//this function takes the geolocation results and creates an object if it finds a town within NZ
function displayMap(response) {
		//variable to store possible NZ town
		var townNZ = "";
		//array of all locations
		var locations = response.results[0].locations;
		//check through responses and find one from NZ
		for (var i = 0; i < locations.length; i++)
		{
			//if town is in NZ
			if (locations[i].adminArea1 == "NZ")
			{	
				//store location in variable
				townNZ = locations[i];
				//clear error message (in case there is one from a previous search)
				document.getElementById("message").innerHTML = "";
			}
		}
		//if town is not found
		if (townNZ == "")
		{
			//display error message
			document.getElementById("message").innerHTML = "No such town exists within New Zealand";
			//set map to initial view of nz
			mymap.setView([-43.9674, 170.489395], 4);
			//stop this function
			return;
		}
		//create town object literal, using information from the NZ town
		var town = {
			name	: townNZ.adminArea5,
			lat	: townNZ.latLng.lat,
			long	: townNZ.latLng.lng,		
		}
		//pass this town object to the recent searches
		showSearches(town);
		//use this town object to change map		
		changeMap(town);
}

//function to move the map to another given location
function changeMap(town) {
		//get latitude and longtitude for town
		latitude = town.lat;
		longtitude = town.long;
		//set the view with lat and long
		mymap.setView([latitude, longtitude], 13);
		//use this lat and long to get weather and sun data
		getWeather(latitude, longtitude);
		getSunData(latitude, longtitude);
}

//this function makes a fetch call to my sun data php script to get the sun data
function getSunData(lat, long) {
		//fetch data from sunrise-sunset
		fetch("PHP/sun.php?lat="+lat+"&long="+long)
		//parse json response 
		.then(response => response.json())
		.then(json => showSunInfo(json));
}

//this function recieves and displays the sunrise and sunset data
function showSunInfo(response) {
		//store data in variables
		var sunrise = response.results.sunrise;
		var sunset = response.results.sunset;
		//locate container
		var sunContainer = document.getElementById("sun");
		//display data in container
		sunContainer.innerHTML = "Sun rises at: "+sunrise+", and sets at: "+sunset+" UTC time";
}

//this function makes a fetch call to my weather php script to get the weather data
function getWeather(lat, long) {
		//typical AJAX request
		request = new XMLHttpRequest();
		url = "PHP/weather.php?key=ca20b1c91fa4ff8dfcb88ce2d2443714&lat="+lat+"&long="+long;
		request.open("GET",url);
		request.onreadystatechange = function(){
			if(request.readyState == 4) {
    			if (request.status == 200) {
    				result = request.responseText; 
    				showWeatherInfo(result);
				}
			}
		};
		request.send();
}

//this function recieves and displays the weather data
function showWeatherInfo(response) {
	let parser = new DOMParser();
	//parses XML
	xmlDoc = parser.parseFromString(response,"text/xml");
	//tags used to display weather info
	temp = xmlDoc.getElementsByTagName("temperature")[0];
	weather = xmlDoc.getElementsByTagName("weather")[0];
	town = xmlDoc.getElementsByTagName("city")[0];
	//using xml tags to write the HTML to display
	display = "<h3>Forecast for "+town.getAttribute('name')+"</h3>"+"Max Temp: "+temp.getAttribute('max')+" Min Temp: "+temp.getAttribute('min')+"<br>Current Outlook: "+weather.getAttribute('value');
	//display data in weather container
	document.getElementById("weather").innerHTML = display;
}

//this function creates objects to add to the recent search list
function showSearches(town) {
		//find list in HTML doc
		var list = document.getElementById("recent");
		//create new list item
		var item = document.createElement('li')
		//create text content for list item
		var content = document.createTextNode(town.name);
		//assemble the list
		item.appendChild(content);
		list.appendChild(item);
		//when clicked, this calls the changeMap function by sending it this town object
		item.onclick = function(){ changeMap(town); };
}
