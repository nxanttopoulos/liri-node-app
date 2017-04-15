// Getting the required packages and local files here.
var twitterApi = require("./keys.js");
var Twitter = require('twitter');
var request = require("request");
var spotify = require('spotify');
var fs = require("fs");
// var consumerKey = twitterApi.twitterKeys.consumer_key;
// var consumerSecret = twitterApi.twitterKeys.consumer_secret;
// var accessKey = twitterApi.twitterKeys.access_token_key;
// var accessSecret = twitterApi.twitterKeys.access_token_secret;
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

// This conditional takes checks the user-input against the different functions and calls them.
// This is the code to get the twitter data.
if (command === "my-tweets") {
	var parameters = {screen_name: 'nodejs', count: 20};
	twitterApi.get('statuses/user_timeline', parameters, function(error, tweets, response) {
  		if (!error) {
    		console.log(tweets);
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
	    	console.log(returnArray[i].artists.name);
	    	console.log(returnArray[i].name);
	    	console.log(returnArray[i].external_urls);
	     	console.log(returnArray[i].album.name);
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
	    		console.log(returnArray[i].artists.name);
	    		console.log(returnArray[i].name);
	    		console.log(returnArray[i].external_urls);
	     		console.log(returnArray[i].album.name);
	    	}
		});
	});
} else {
	console.log("Sorry, I'm afraid I didn't understand that.");
}