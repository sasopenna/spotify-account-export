function startLoop(id = 0, index = 0) {
  if(!started) {
    uploadBar(0, "Stopped.")
    return;
  }

  let data_array = [
    ["addToMySavedTracks", songs_array, "songs", MAX_SPOTIFY_QUERY, "id"],
    ["addToMySavedAlbums", albums_array, "albums", MAX_SPOTIFY_QUERY, "id"],
    ["followArtists", artists_array, "artists", MAX_SPOTIFY_QUERY, "id"],
    ["followPlaylist", getFromArray(playlists_array, "owner", user_array.id), "playlist", 1, ""],
    ["createPlaylist", getFromArray(playlists_array, "owner", user_array.id, false), "playlist", 1, ""]
  ];

  if(id >= data_array.length) {
    uploadBar(user_array.total, "");
    started = false;
    return;
  }

  let da = data_array[id];
  sendData(da[0], da[1], da[2], id, index, da[3], da[4]);
}

function sendData(parent, array_data, type, id, index, limit, get_t) {
  let array = spliceArray(array_data, limit, get_t);
  if(array.length == 0) {
    id++;
    startLoop(id, 0);
    return;
  }
  let data = array[index];
  let len = data.length;

  let obj_array = [
    { ids: data },
    { ids: data },
    [ data ],
    { ownerId: data.owner, playlistId: data.id, public: data.public },
    { userId: other_array.id, public: data.public, name: data.name, collaborative: data.collaborative }
  ];

  spotifyApi[parent](obj_array[id], function(get_error, get_data) {
    if(get_error) {
      uploadBar(0, "Error. Check the browser console.");
      started = false;
      return;
    }

    uploadBar(user_array.progress, ("Added " + ((len == undefined) ? data.name : len) + " " + type));
    user_array.progress += (len == undefined) ? limit : len;

    if(data.tracks) {
      if(data.owner == user_array.id) {
        let arr = spliceArray(data.tracks, MAX_SPOTIFY_PLAYLISTS_QUERY);
        let playlist_id = get_data.id;
        for(track of arr) {
          spotifyApi.addTracksToPlaylist(other_array.id, playlist_id, track);
        }
      }
    }

    index++;

    if(index < array.length) startLoop(id, index);
    else {
      id++;
      startLoop(id, 0);
    }
  });
}
