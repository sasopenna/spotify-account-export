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
