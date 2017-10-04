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
liri(userChoice, userReq);

function liri(userChoice, userReq) {
	switch(userChoice) {
		case 'my-tweets':
			runTwitter();
			break;
		case 'spotify-this-song':
			if(userReq == null){
				runSpotify('The Sign')
			}else{
				runSpotify(userReq);
			}
			break;
		case 'movie-this':
			if(userReq == null){
				runMovie('Mr.Nobody');
			}else{
				runMovie(userReq);
			}
			break;
		case 'do-what-it-says':
			//console.log("in do-what-it-says");
			runRandom();
			break;
		default: 
			//console.log("default");
			console.log("Invalid! try one of these my-tweets, spotify-this-song <song-choice>, movie-this <movie-choice>, do-what-it-says");
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
	//var movie = movie.split(' ').join('&');
	//var data = JSON.parse(body);
	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + omdb_ck;

	//console.log(queryUrl);

	request(queryUrl, function(error, response, body) {

	  if (!error && response.statusCode === 200){
	  	var data = JSON.parse(body);
	  	console.log("Title: " + data.Title);
	    console.log("Release Year: " + data.Year);
	    console.log("Actors: " + data.Actors);
	    console.log("IMDB Rating: " +  data.imdbRating);
	    console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
	    console.log("Country Produced: " +  data.Country);
	    console.log("Language: " + data.Language);
	    console.log("Plot: " + data.Plot);
	  }else {
	  	console.error('An error occured!');
	  }
	});

}


function runRandom() {
	//node liri.js do-what-it-says
	//Liri will take text in random.txt; should run spotify-this-song "I want it that way"
	var fs = require('fs');

	fs.readFile("random.txt", "utf8", function(error,data) {
		if(error) {
			return console.log(error);
		}
		//console.log("string: ", data);

		var dataArr = data.split(",");

		//console.log("split: ", dataArr);

		var comm = dataArr[0];
		var req = dataArr[1];

		//console.log("command ", comm);
		//console.log("request ", req);
		if(comm != 'do-what-it-says') {
			liri(comm, req);
		}else{
			console.log("Invalid! try one of these my-tweets, spotify-this-song <song-choice>, movie-this <movie-choice>, do-what-it-says");
		}
		
	});
}

//Bonus: log.txt file, append check command you run to log.txt

