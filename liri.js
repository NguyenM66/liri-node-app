//Write code to grab data from keys.js. Then store keys in a variable
var keys = require("./keys.js");
var userChoice = process.argv[2];
var userReq = process.argv[3];
var twitter_ck = keys.twitterKeys.consumer_key;
var twitter_cs = keys.twitterKeys.consumer_secret;
var twittter_atk = keys.twitterKeys.access_token_key;
var twitter_ats = keys.twitterKeys.access_token_secret;
var spotify_ck = keys.spotifyKeys.consumer_key;
var spotify_cs = keys.spotifyKeys.consumer_secret;
var omdb_ck = keys.moviedbKey.consumer_key;


//Make it so Liri can take in one of the following commands: my-tweets, spotify-this-song, movie-this or do-what-it-says
liri();

function liri() {
	// switch(userChoice) {
	// 	case 0:
	// 		'my-tweets';
	// 		runTwitter();
	// 		break;
	// 	case 1:
	// 		'spotify-this-song';
	// 		runSpotify(userReq);
	// 		break;
	// 	default: 
	// 		console.log("Invalid!");
	// }
	if (userChoice == 'my-tweets') {
		runTwitter();
	}else if (userChoice == 'spotify-this-song') {
		runSpotify(userReq);
	}else if (userChoice == 'movie-this') {
		runMovie(userReq);
	}else if (userChoice == 'do-what-it-says'){

	}else {
		console.log("Invalid!");
	}
	// liri();
}


function runTwitter() {
	//node liri.js my-tweets
	//Shows your last 20 tweets and when they were created in terminal 
	var Twitter = require('twitter');

	var client = new Twitter({
	  consumer_key: twitter_ck,
	  consumer_secret: twitter_cs,
	  access_token_key: twittter_atk,
	  access_token_secret: twitter_ats
	});
	 
	var params = {screen_name: 'phuongybaby'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	for (var i = 0; i < tweets.length && i < 20; i++) {
	  		var curTweet = tweets[i];
	  		console.log(curTweet.user.name + " Tweeted: " + curTweet.text + " on " + curTweet.user.created_at);
	  	}
	  }else {
	  	console.error('An error occured!');
	  }
	});
}


function runSpotify(song) {
	//node liri.js spotify-this-song '<song name here>'
	//Shows Artist, Song's name, Preview link of song, Album song is from
	//If no song is provided program will default "The Sign" by Ace of Base
	var Spotify = require('node-spotify-api');
	 
	var spotify = new Spotify({
	  id: spotify_ck,
	  secret: spotify_cs
	});
	 
	spotify.search({ type: 'track', query: song}, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	//Artist
	console.log("Artist: ", data.tracks.items[0].artists[0].name); 
	//Song's name
	console.log("Song: ", data.tracks.items[0].name);
	//Album song is from
	console.log("Album: ", data.tracks.items[0].album.name);
	//Prewview link of song
	console.log("Preview: ", data.tracks.items[0].artists[0].external_urls);

	});
}


function runMovie(movie) {
	//node liri.js movie-this '<movie name here>'
	//Outputs Title of Movie, Year came out, IMDB rating, Rotten Tomatoes rating, Country prodced, Language, Plot, Actors
	//if the user doesn't type in a movie it will output 'Mr Nobody'
	var request = require("request");
	var movie = movie.split(' ').join('&');
	//var data = JSON.parse(body);
	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + omdb_ck;

	console.log(queryUrl);

	request(queryUrl, function(error, response, body) {

	  if (!error && response.statusCode === 200) {
	  	console.log("Title: " + JSON.parse(body).Title);
	    console.log("Release Year: " + JSON.parse(body).Year);
	    console.log("Actors: " + JSON.parse(body).Actors);
	    console.log("IMDB Rating: " +  JSON.parse(body).imdbRating);
	    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
	    console.log("Country Produced: " +  JSON.parse(body).Country);
	    console.log("Language: " + JSON.parse(body).Language);
	    console.log("Plot: " + JSON.parse(body).Plot);
	    
	  }else {
	  	movie = "Mr.Nobody";
	  	console.log("Mr.Nobody");
	  }
	});

}

// var request = require('request');
// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });

//node liri.js do-what-it-says
//Liri will take text in random.txt; should run spotify-this-song "I want it that way"

//Bonus: log.txt file, append check command you run to log.txt

