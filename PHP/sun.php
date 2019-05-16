<?php
	//store GET variables
	$lat = $_GET["lat"];
	$long = $_GET["long"];
	//call to sunrise-sunset API
	$url = "https://api.sunrise-sunset.org/json?lat=".$lat."&lng=".$long."&date=today";
	//to initialise and use cURL
	$process = curl_init($url);

  	curl_setopt($process, CURLOPT_RETURNTRANSFER, TRUE);
  	$return = curl_exec($process);

  	echo $return;
  
  	curl_close($process);
?>
