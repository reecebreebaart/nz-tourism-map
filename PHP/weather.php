<?php
	//store GET variables
	$apikey = $_GET["key"];
	$lat = $_GET["lat"];
	$long = $_GET["long"];
	//call to openweathermap API
	$url = "api.openweathermap.org/data/2.5/weather?lat=".$lat."&lon=".$long."&apikey=".$apikey."&mode=xml&units=metric";
	//to initialise and use cURL
	$process = curl_init($url);
  
  	curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
  	$return = curl_exec($process);
    
	echo $return;
  
  	curl_close($process);
?>
