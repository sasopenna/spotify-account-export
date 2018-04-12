const MAX_SPOTIFY_PLAYLISTS_QUERY = 100;
const MAX_SPOTIFY_QUERY = 50;

let CHECK_ID = 0;

let spotifyApi = new SpotifyWebApi();
let token = "";

let user_array = [];
let other_array = [];
let songs_array = [];
let albums_array = [];
let artists_array = [];
let playlists_array = [];
let main_array = [true, true, true, true];

let otheruser = false;
let started = false;

console.log("test");

const OAUTH_LINK = "https://beta.developer.spotify.com/console/get-current-user/";
const LOGIN_LINK = "https://accounts.spotify.com/login";

let oauth_links = document.getElementsByName("getoauth");
let login_links = document.getElementsByName("loginlink");

for (let oauth of oauth_links) {
  oauth.href = OAUTH_LINK;
}

for (let login of login_links) {
  login.href = LOGIN_LINK;
}