const CHECK_LIMIT = 5;

const _ME = 0;
const _TRACKS = 1;
const _ALBUMS = 2;
const _ARTISTS = 3;
const _PLAYLISTS = 4;

function startCheck(type = 0) {
  if(CHECK_ID >= CHECK_LIMIT) return;
  if(type == 0) {
    switch(CHECK_ID) {
      case _ME: spotifyApi.getMe(gotStats); break;
      case _TRACKS: spotifyApi.getMySavedTracks({limit: 1}, getLength); break;
      case _ALBUMS: spotifyApi.getMySavedAlbums({limit: 1}, getLength); break;
      case _ARTISTS: spotifyApi.getFollowedArtists({limit: 1}, getLength); break;
      case _PLAYLISTS: spotifyApi.getUserPlaylists({limit: 1}, getLength); break;
    }
    CHECK_ID++; //after
  } else {
    CHECK_ID++; //before
    getSaved(0);
  }
}

function getLength(error, data) {
  if(error) {
    searchImg[0].className = "search";
    percentDiv[0].style.background = "#FF0000";
    percentDiv[0].style.width = "100.00%";
    percentDiv[0].innerHTML = "There was an error. Try again.";
    started = false;
    return;
  }

  let check = CHECK_ID - 2;
  let max = (check != 2) ? data.total : data.artists.total;

  user_array.tot_arr[check] = max;
  user_array.total += max;

  if(CHECK_ID >= CHECK_LIMIT) {
    CHECK_ID = 1;
    getSaved(0);
  } else startCheck();
}

function getSaved(off) {
  if(CHECK_ID >= CHECK_LIMIT) {
    searchImg[0].className = "search";
    started = false;
    contentDiv.style.display = "block";
    footerDiv.style.display = "block";
    return;
  }
  let check = CHECK_ID - 1;
  let max = user_array.tot_arr[check];

  let parent_array = [
    ["getMySavedTracks", songs_array, "songs", "track"],
    ["getMySavedAlbums", albums_array, "albums", "album"],
    ["getFollowedArtists", artists_array, "artists", "artist"],
    ["getUserPlaylists", playlists_array, "playlists", "playlist"]
  ];
  let get_type = parent_array[check][3];
  let parent = parent_array[check][0];
  let array = parent_array[check][1];
  let type = parent_array[check][2];

  if(max == 0) {
    showType(type, array);
    startCheck(1);
    return;
  }

  spotifyApi[parent]({
    limit: MAX_SPOTIFY_QUERY,
    offset: off
  }, function(error, data) {
    if(error) {
      searchImg[0].className = "search";
      percentDiv[0].style.background = "#FF0000";
      percentDiv[0].style.width = "100.00%";
      percentDiv[0].innerHTML = "There was an error. Try again.";
      started = false;
      return;
    }

    let value = (check != 2) ? data.items : data.artists.items;

    for(val of value) {
      let obj = {
        type: get_type,
        export: main_array[check]
      };

      switch(CHECK_ID) {
        case _TRACKS:
          obj.name = val.track.name;
          obj.id = val.track.id;
          obj.img = (val.track.album.images[0]) ? val.track.album.images[0].url : "img/noimg.jpg";
          break;
        case _ALBUMS:
          obj.name = val.album.name;
          obj.id = val.album.id;
          obj.img = (val.album.images[0]) ? val.album.images[0].url : "img/noimg.jpg";
          break;
        case _ARTISTS:
          obj.name = val.name;
          obj.id = val.id;
          obj.img = (val.images[0]) ? val.images[0].url : "img/noimg.jpg";
          break;
        case _PLAYLISTS:
          obj.name = val.name;
          obj.public = val.public;
          obj.collaborative = val.collaborative;
          obj.id = val.id;
          obj.img = (val.images[0]) ? val.images[0].url : "img/noimg.jpg";
          obj.owner = val.owner.id;
          obj.tracks = (val.owner.id != user_array.id) ? [] : getTracks(val.owner.id, val.id, val.tracks.total);
          break;
      }

      if(val.track || val.album) {
        let art = [], artists_array = (val.track) ? val.track : val.album;
        for(artist of artists_array.artists) {
          art.push(artist.name);
        }
        obj.artists = art;
      }

      array.push(obj);
    }

    updateBar(value.length);
    off += MAX_SPOTIFY_QUERY;

    if(off < max) getSaved(off);
    else {
      showType(type, array);
      startCheck(1);
    }
  });
}

function getTracks(user_id, playlist_id, total) {
  let tracks_id = [];

  for(let off = 0; off <= total; off += MAX_SPOTIFY_PLAYLISTS_QUERY) {
    spotifyApi.getPlaylistTracks(user_id, playlist_id, {
      limit: MAX_SPOTIFY_PLAYLISTS_QUERY,
      offset: off
    }, function(error, data) {
      if(error) return;

      let value = data.items;
      for(tracks of value) {
        tracks_id.push("spotify:track:" + tracks.track.id);
      }
    });
  }
  return tracks_id;
}
