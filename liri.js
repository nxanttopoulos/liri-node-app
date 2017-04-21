// Getting the required packages and local files here.
var twitterApi = require("./keys.js");
var Twitter = require('twitter');
var request = require("request");
var spotify = require('spotify');
var fs = require("fs");
var command = process.argv[2];
var userInput = process.argv;
var searchRequest = "";
var movieName = "";

// Gets the user's input and readies it for data requests.
for (var i = 3; i < userInput.length; i++) {
  if (i > 3 && i < userInput.length) {
    movieName = movieName + "+" + userInput[i];
    searchRequest = searchRequest + "+" + userInput[i];
  }
  else {
    movieName += userInput[i];
    searchRequest += userInput[i];
  }
}

// If no query is input from user, defaults are added.
if (movieName === "") {
	movieName = "Mr.Nobody";
}
if (searchRequest === "") {
	searchRequest = "The Sign";
}

// This is the code to get the twitter data.
var newTwit = new Twitter ({
  consumer_key: 'PZoS8VutLm0k2mhv05nQTPibY',
  consumer_secret: 'IavLhAnXL6q0GmmuaRhJXP7Y6L2KLmT2BQtNQDFgAIv5UiEzht',
  access_token_key: '852227480773644289-aMn0gS2Qkdld4KrPm0fcPKWwkIZKbb7',
  access_token_secret: 'Akh1Q0iDf02ozk6CnxGGgzbVMOgbe73J7EBr6d2idbjEc',
});

// This conditional takes checks the user-input against the different functions and calls them.
if (command === "my-tweets") {
	var parameters = {screen_name: 'Fake_Twitt_Acnt', count: 20};
	newTwit.get('statuses/user_timeline', parameters, function(error, tweets, response) {
  		if (!error) {
  			var returnObject = JSON.parse(response.body);
    		for (i=0; i < returnObject.length; i++) {
    			console.log("Tweet #" + (20-[i]) + " " + returnObject[i].text);
    		}
  		}
	});
} else if (command === "movie-this") {
// This is code to get the OMDB data and save the user's search.
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";
	request(queryUrl, function(error, response, body) {
		  if (!error && response.statusCode === 200) {
		    console.log("The Title of the movie is: " + JSON.parse(body).Title);
		    console.log("The year the movie came out is: " + JSON.parse(body).Year);
		    console.log("The IMDB Rating of the movie is: " + JSON.parse(body).imdbRating);
		    console.log("The country where the movie was produced is: " + JSON.parse(body).Country);
		    console.log("The language of the movie is: " + JSON.parse(body).Language);
		    console.log("The plot of the movie is: " + JSON.parse(body).Plot);
		    console.log("The actors in the movie are: " + JSON.parse(body).Actors);
		    console.log("The Rotten Tomatoes Rating of the movie is: " + JSON.parse(body).Ratings[1].Value);
		    console.log("The Rotten Tomatoes URL of the movie is: " + JSON.parse(body).Ratings[1].Source);
		  }
	});
} else if (command === "spotify-this-song") {
// This is code to get the Spotify Data. 
	spotify.search({ type: 'track', query: searchRequest }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	 	var returnObject = data.tracks;
	 	var returnArray = returnObject.items;
	    for (i=0; i < returnArray.length; i++){
	    	console.log("Artist: " + returnArray[i].album.name);
	    	console.log("Song Name:  " + returnArray[i].name);
	    	console.log("Preview Link from Spotify:  " + JSON.stringify(returnArray[i].external_urls));
	     	console.log("Album Name: " + returnArray[i].album.name);
	     	console.log("------------------------------------------");
	     	console.log("------------------------------------------");
	    }
	});
} else if (command === "do-what-it-says") {
// This is the code to read the text file and use the spotify code to make a request.
	fs.readFile("random.txt", "utf8", function(error, data) {
	  var dataArr = data.split(",");
	  var liriCommand = dataArr[0];
	  var trackName = dataArr[1];
		 spotify.search({ type: 'track', query: trackName }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    }
		    var returnObject = data.tracks;
		    var returnArray = returnObject.items;
	 		for (i=0; i < returnArray.length; i++){
	    		console.log("Artist: " + returnArray[i].album.name);
	    		console.log("Song Name:  " + returnArray[i].name);
	    		console.log("Preview Link from Spotify:  " + returnArray[i].external_urls);
	     		console.log("Album Name: " + returnArray[i].album.name);
	     		console.log("------------------------------------------");
	     		console.log("------------------------------------------");
	    	}
		});
	});
} else {
	// If user does not enter an appopriate command, return error.
	console.log("Sorry, I'm afraid I didn't understand that.");
}