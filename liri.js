//requires and related necessary thigns
require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const Spotify = require("node-spotify-api");

const keys = require("./keys.js");

const spotify = new Spotify(keys.spotify);

//user input assignment
const argv = process.argv;
let arg1 = argv[2];
let arg2 = argv[3];

//in case the title is seperated by spaces taking them from the array and storing as a string to pass to spotify or OMDB
if (argv.length > 4) {
    const argArray = [];
    for (let i = 3; i < argv.length; i++) {
        argArray.push(argv[i]);
    }
    arg2 = argArray.join(" ");
}


//spotify-This-song
function spotifySearch() {
    //in case no argument entered
    if (arg2 == null) {
        arg2 = "no problem";
    }
    spotify
        .search({ type: 'track', query: arg2 })
        .then(function(response) {


            const info = response.tracks.items[0];
            // console.log(info);
            //Artist
            const artist = info.album.artists[0].name;
            //album
            const album = info.album.name;
            //URL
            const url = info.preview_url;
            //track name
            const track = info.name;
            //logging information
            console.log(`
Artist: ${artist}
Album: ${album}
Name: ${track}
Preview: ${url}
`) //error handling
        })
        .catch(function(err) {
            console.log(err);
        });
}

//movie
function OMDBSearch() {
    //set default movie if nothing was entered
    if (arg2 == null) {
        arg2 = "repo man";
    }
    //omdb URL
    const queryUrl = "http://www.omdbapi.com/?t=" + arg2 + "&y=&plot=short&apikey=trilogy";
    //Rotten tomatoes rating holder
    let rt = "";
    //axios call taken from activities
    axios.get(queryUrl).then(
            function(response) {
                // fetching rotten tomatoes from array an dputting it in rt or saying unavailable
                for (let i = 0; i < response.data.Ratings.length; i++) {
                    if (response.data.Ratings[i].Source === "Rotten Tomatoes") {
                        rt = response.data.Ratings[i].Value;
                        break;
                    } else {
                        rt = "unavailable";
                    }
                }
                //all the info to print
                console.log(`
Title: ${response.data.Title}
Year: ${response.data.Year}
IMDB Rating: ${response.data.imdbRating}
Rotten Tomatoes: ${rt}
Country: ${response.data.Country}
Language: ${response.data.Language}
Plot: ${response.data.Plot}
Actors: ${response.data.Actors}
`);
            }) //comicated error handling from activity
        .catch(function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}
//funciton that reads from text file
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        const dataArr = data.split(",");
        arg1 = dataArr[0];
        arg2 = dataArr[1];

        if (arg1 === "spotify-this") {
            spotifySearch();
        }

        if (arg1 === "movie-this") {
            OMDBSearch();
        }
    })



}

//basic statements that starts things
if (arg1 === "do-what-it-says") {
    doWhatItSays();
} else if (arg1 === "spotify-this") {
    spotifySearch();
} else if (arg1 === "movie-this") {
    OMDBSearch();
} else {
    //if no proper command was entered give info on how to use
    console.log(`
Not a proper command to use LIRI enter:

spotify-this "song title" 
or
movie-this "movie title"
or
do-what-it-says`)
}