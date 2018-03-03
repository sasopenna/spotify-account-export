let token = "";
let spotifyApi = new SpotifyWebApi();

let user_array = [];
let other_array = [];
let songs_array = [];
let albums_array = [];
let artists_array = [];
let playlists_array = [];
let main_array = [true, true, true, true];

let otheruser = false;
let started = false;
let maxquery = 50;
let getAuth = [
  document.getElementById("p1_auth"),
  document.getElementById("p2_auth"),
];
let percentDiv = [
  document.getElementById("p1_bar"),
  document.getElementById("p2_bar")
];
let contentDiv = document.getElementById("content");
let footerDiv = document.getElementById("footer");

getAuth[0].value = token;
getAuth[0].addEventListener("keydown", function(e) {
  if(e.keyCode != 13) return;
  if(started) return;

  started = true;
  otheruser = false;
  token = getAuth[0].value;

  user_array = [];
  other_array = [];
  songs_array = [];
  albums_array = [];
  artists_array = [];
  playlists_array = [];

  document.getElementById("p1_birth").innerHTML = "";
  document.getElementById("p1_email").innerHTML = "";
  document.getElementById("p1_name").innerHTML = "Get Infos from this Account: ";
  document.getElementById("p1_img").src = "img/noimg.jpg";
  document.getElementById("p1_songs").innerHTML = "";
  document.getElementById("p1_albums").innerHTML = "";
  document.getElementById("p1_artists").innerHTML = "";
  document.getElementById("p1_playlists").innerHTML = "";

  document.getElementById("p2_birth").innerHTML = "";
  document.getElementById("p2_email").innerHTML = "";
  document.getElementById("p2_name").innerHTML = "Send Infos to this Account: ";
  document.getElementById("p2_img").src = "img/noimg.jpg";
  document.getElementById("p2_console").innerHTML = "";

  percentDiv[1].innerHTML = "";
  percentDiv[1].style.width = "0%";
  percentDiv[1].style.background = "#1db954";

  footerDiv.style.display = "none";
  contentDiv.style.display = "none";
  spotifyApi.setAccessToken(token);
  startCheck();
});

getAuth[1].addEventListener("keydown", function(e) {
  if(e.keyCode != 13) return;
  if(started) return;
  if(!Object.keys(user_array).length) {
    percentDiv[1].style.background = "#FF0000";
    percentDiv[1].style.width = "100%";
    percentDiv[1].innerHTML = "You need to insert the first account.";
    return;
  }
  document.getElementById("p2_birth").innerHTML = "";
  document.getElementById("p2_email").innerHTML = "";
  document.getElementById("p2_name").innerHTML = "Send Infos to this Account: ";
  document.getElementById("p2_img").src = "img/noimg.jpg";
  document.getElementById("p2_console").innerHTML = "";

  percentDiv[1].innerHTML = "";
  percentDiv[1].style.width = "0%";
  percentDiv[1].style.background = "#1db954";

  started = true;

  spotifyApi.setAccessToken(getAuth[1].value);
  spotifyApi.getMe(function(error, data) {
    if(error) {
      percentDiv[1].style.background = "#FF0000";
      percentDiv[1].style.width = "100%";
      percentDiv[1].innerHTML = "Make sure this OAuth token is correct.";
      started = false;
      return;
    }

    let user = data;
    other_array = user;

    if(user.id == user_array.id) {
      percentDiv[1].style.background = "#FF0000";
      percentDiv[1].style.width = "100%";
      percentDiv[1].innerHTML = "Can't put the same account of the first one.";
      started = false;
      return;
    }

    document.getElementById("p2_birth").innerHTML = "Birthday: " + user.birthdate;
    document.getElementById("p2_email").innerHTML = "E-mail: " + user.email;
    document.getElementById("p2_name").innerHTML = 'Send Infos to this Account: <a href="' + user.external_urls.spotify + '">' + user.display_name + '</a>';
    document.getElementById("p2_img").src = (user.images.length) ? user.images[0].url : "img/noimg.jpg";

    otheruser = true;
    started = false;
  });
});

document.getElementById("convert").addEventListener("click", function(e) {
  if(!otheruser) return;

  started = !started;

  percentDiv[1].innerHTML = "";
  percentDiv[1].style.width = "0%";
  percentDiv[1].style.background = "#1db954";

  user_array.progress = 0;
  document.getElementById("p2_console").innerHTML = "";
  document.getElementById("convert").innerHTML = (!started) ? "Send Here" : "Stop";

  if(started) {
    user_array.total = spliceArray(songs_array, 1).length + spliceArray(albums_array, 1).length + spliceArray(artists_array, 1).length + spliceArray(playlists_array, 1).length;
    startLoop();
  }
});

resizeBD();

function startCheck(id = 0) {
  if(id >= 5) return;

  if(id == 0)       spotifyApi.getMe(getStats);
  else if(id == 1)  spotifyApi.getMySavedTracks({limit: 1}, getSavedTracks);
  else if(id == 2)  spotifyApi.getMySavedAlbums({limit: 1}, getSavedAlbums);
  else if(id == 3)  spotifyApi.getFollowedArtists({limit: 1}, getSavedArtists);
  else if(id == 4)  spotifyApi.getUserPlaylists({limit: 1}, getSavedPlaylists);
}

function getStats(error, data) {
  if(error) {
    percentDiv[0].style.background = "#FF0000";
    percentDiv[0].style.width = "100%";
    percentDiv[0].innerHTML = "Make sure this OAuth token is correct.";
    started = false;
    return;
  }

  percentDiv[0].innerHTML = "";
  percentDiv[0].style.width = "0%";
  percentDiv[0].style.background = "#1db954";

  document.getElementById("p1_birth").innerHTML = "";
  document.getElementById("p1_email").innerHTML = "";
  document.getElementById("p1_name").innerHTML = "Get Infos from this Account: ";
  document.getElementById("p1_img").src = "img/noimg.jpg";

  user_array = data;
  user_array.total = 0;
  user_array.start = 0;
  user_array.progress = 0;
  getAuth[0].value = token;

  document.getElementById("p1_birth").innerHTML = "Birthday: " + user_array.birthdate;
  document.getElementById("p1_email").innerHTML = "E-mail: " + user_array.email;
  document.getElementById("p1_name").innerHTML = 'Get Infos from this Account: <a href="' + user_array.external_urls.spotify + '">' + user_array.display_name + '</a>';
  document.getElementById("p1_img").src = (user_array.images.length) ? user_array.images[0].url : "img/noimg.jpg";

  startCheck(1);
}

function getSavedTracks(error, data) {
  if(error) { started = false; return; }

  let maxsongs = data.total;
  user_array.total += maxsongs;

  if(maxsongs == 0) {
    show("songs", songs_array);
    startCheck(2);
  }

  for(let off = 0; off <= maxsongs; off += maxquery) {
    spotifyApi.getMySavedTracks({
      limit: maxquery,
      offset: off
    }, function(error, data) {
      let value = data.items;
      let idx = off;
      for(song of value) {
        let art = [];
        for(artist of song.track.artists) {
          art.push(artist.name);
        }

        songs_array.push({
          type: "track",
          export: true,
          index: idx,
          name: song.track.name,
          id: song.track.id,
          img: song.track.album.images[0].url,
          artists: art
        });

        songs_array.sort(function(a, b) {
          return a.index - b.index;
        });

        idx++;
        updateBar();

        if(songs_array.length == maxsongs) {
          show("songs", songs_array);
          startCheck(2);
        }
      }
    });
  }
}

function getSavedAlbums(error, data) {
  if(error) { started = false; return; }

  let maxalbums = data.total;
  user_array.total += maxalbums;

  if(maxalbums == 0) {
    show("albums", albums_array);
    startCheck(3);
  }

  for(let off = 0; off <= maxalbums; off += maxquery) {
    spotifyApi.getMySavedAlbums({
      limit: maxquery,
      offset: off
    }, function(error, data) {
      let value = data.items;
      let idx = off;

      for(albums of value) {
        let art = [];
        for(artist of albums.album.artists) {
          art.push(artist.name);
        }

        albums_array.push({
          type: "album",
          export: true,
          name: albums.album.name,
          artists: art,
          img: albums.album.images[0].url,
          id: albums.album.id
          //albums.album.id
        });

        albums_array.sort(function(a, b) {
          return a.index - b.index;
        });

        idx++;
        updateBar();

        if(albums_array.length == maxalbums) {
          show("albums", albums_array);
          startCheck(3);
        }
      }
    });
  }
}

function getTracks(user_id, playlist_id, total) {
  let tracks_id = []
  let maxq = 100;

  for(let off = 0; off <= total; off += maxq) {
    spotifyApi.getPlaylistTracks(user_id, playlist_id, {
      limit: maxq,
      offset: off
    }, function(error, data) {
      let value = data.items;
      for(tracks of value) {
        tracks_id.push("spotify:track:" + tracks.track.id);
      }
    });
  }
  return tracks_id;
}

function getSavedPlaylists(error, data) {
  if(error) { started = false; return; }

  let maxplaylists = data.total;
  user_array.total += maxplaylists;

  if(maxplaylists == 0) {
    show("playlists", playlists_array);
    started = false;
    contentDiv.style.display = "block";
    footerDiv.style.display = "block";
  }

  for(let off = 0; off <= maxplaylists; off += maxquery) {
    spotifyApi.getUserPlaylists({
      limit: maxquery,
      offset: off
    }, function(error, data) {
      let value = data.items;
      let idx = off;

      for(play of value) {
        playlists_array.push({
          type: "playlist",
          export: true,
          index: idx,
          name: play.name,
          public: play.public,
          collaborative: play.collaborative,
          id: play.id,
          img: (play.images[0]) ? play.images[0].url : "",
          owner: play.owner.id,
          tracks: (play.owner.id.indexOf("spotify") !== -1) ? [] : getTracks(play.owner.id, play.id, play.tracks.total)
        });

        playlists_array.sort(function(a, b) {
          return a.index - b.index;
        });

        idx++;
        updateBar();

        if(playlists_array.length == maxplaylists) {
          show("playlists", playlists_array);
          started = false;
          contentDiv.style.display = "block";
          footerDiv.style.display = "block";
          //showSongs();
        }
      }
    });
  }
}

function getSavedArtists(error, data) {
  if(error) { started = false; return; }

  let maxartists = data.artists.total;
  user_array.total += maxartists;

  if(maxartists == 0) {
    show("artists", artists_array);
    startCheck(4);
  }

  for(let off = 0; off <= maxartists; off += maxquery) {
    spotifyApi.getFollowedArtists({
      limit: maxquery,
      offset: off
    }, function(error, data) {
      let value = data.artists.items;
      let idx = off;

      for(art of value) {
        artists_array.push({
          type: "artist",
          export: true,
          name: art.name,
          img: art.images[0].url,
          id: art.id
        });

        artists_array.sort(function(a, b) {
          return a.index - b.index;
        });

        idx++;
        updateBar();

        if(artists_array.length == maxartists) {
          show("artists", artists_array);
          startCheck(4);
        }
      }
    });
  }
}

function updateBar() {
  user_array.start++;
  let divide = ((user_array.start/user_array.total) * 100).toFixed(2) + "%";
  percentDiv[0].style.width = divide;
  percentDiv[0].innerHTML = divide;
}

function show(id, array) {
  let div = "";
  for(let e = 0; e < array.length; e++) {
    let element = array[e];
    let link = 'https://open.spotify.com/' + ((element.type !== "playlist") ? (element.type + '/' + element.id) : ('user/' + element.owner + '/' + element.type + '/' + element.id));
    div += '\
    <table width="100%" class="zz">\
      <tr>\
        <td style="vertical-align: middle" rowspan="2" width="1%"><img id="' + id[2] + e + '"  onclick="selectOption(this)" src="img/add.png" onmouseover="changeOver(this, 1)" onmouseout="changeOver(this, 0)" width="24px" height="24px" style="cursor:pointer"></td>\
        <td rowspan="2" width="1%"><img ' + ((element.type != 'artist') ? 'class="square"': '') + ' width="48px" height="48px" src="' + element.img + '"></td>\
        <td><a href="' + link +'">' + element.name + '</a></td>\
      </tr>\
      <tr>\
        <td class="cc">';
    if(element.artists) {
      div += '' + element.artists[0];
      for(let i = 1; i < element.artists.length; i++) {
        div += ', ' + element.artists[i];
      }
    }
    div+='</td>\
      </tr>\
    </table>';
  }
  document.getElementById("p1_" + id).innerHTML = div;
  document.getElementById("p1_total" + id).innerHTML = "Total " + id + ": " + array.length;
}

function changeOver(parent, id) {
  parent.src = (id) ? "img/remove.png" : "img/add.png";
}

function selectOption(parent, change = -1) {
  if(started) return;

  let type = [parent.id.substring(0, 1), ""];
  let array = [];
  if(type[0] !== "m") {
    let number = parseInt(parent.id.substring(1));
    switch(type[0]) {
      case "n": array = songs_array; type[1] = "songs"; break;
      case "b": array = albums_array; type[1] = "albums"; break;
      case "t": array = artists_array; type[1] = "artists"; break;
      case "a": array = playlists_array; type[1] = "playlists"; break;
    }

    if(change == -1) {
      change = !array[number].export;
    }
    array[number].export = change;
  } else {
    //let
    type[0] = parseInt(parent.id.substring(4));
    switch(type[0]) {
      case 0: array = songs_array; type[1] = "songs"; break;
      case 1: array = albums_array; type[1] = "albums"; break;
      case 2: array = artists_array; type[1] = "artists"; break;
      case 3: array = playlists_array; type[1] = "playlists"; break;
    }

    change = !main_array[type[0]];
    main_array[type[0]] = change;

    for(let a = 0; a < array.length; a++) {
      selectOption(document.getElementById(type[1][2] + a), change);
    }
  }

  parent.onmouseover = function() { changeOver(parent, change); }
  parent.onmouseout = function() { changeOver(parent, !change); }
  parent.src = (change) ? "img/add.png" : "img/remove.png";

  document.getElementById("p1_total" + type[1]).innerHTML = "Total " + type[1] + ": " + spliceArray(array, 1, "id").length;
}

/////altro

function uploadBar(index_length, cons) {
  if(!started) return;
  let divide = ((index_length/user_array.total) * 100).toFixed(2);
  if(divide >= 100.00) {
    divide = 100.00.toFixed(2);
    document.getElementById("convert").innerHTML = "Send Here";
  }

  percentDiv[1].style.width = divide + "%";
  percentDiv[1].innerHTML = (divide > 0 ) ? (divide + "%") : "";

  let div = document.getElementById("p2_console").innerHTML;
  div = '<span class="cc">' + (((divide < 100.00)) ? cons : 'Finished. 100%') + '</span><br>' + div;
  document.getElementById("p2_console").innerHTML = div;
}

function startLoop(id = 0, index = 0) {
  if(!started) {
    uploadBar(0, "Stopped.")
    return;
  }

  if(id == 0) {
    let array = spliceArray(songs_array, 50, "id");
    if(array.length == 0) {
      startLoop(1, 0);
      return;
    }
    spotifyApi.addToMySavedTracks({
      ids: array[index]
    }, function(error, data) {
      if(error) {
        uploadBar(0, "Error. Check the browser console.");
        started = false;
        return;
      }
      uploadBar(user_array.progress, "Added " + array[index].length + " songs");
      user_array.progress += array[index].length;

      index++;

      if(index < array.length) { startLoop(id, index); }
      else { startLoop(1, 0); }
    });
  } else if(id == 1) {
    let array = spliceArray(albums_array, 50, "id");
    if(array.length == 0) {
      startLoop(2, 0);
      return;
    }
    spotifyApi.addToMySavedAlbums({
      ids: array[index]
    }, function(error, data) {
      if(error) {
        uploadBar(0, "Error. Check the browser console.");
        started = false;
        return;
      }
      uploadBar(user_array.progress, "Added " + array[index].length + " albums");
      user_array.progress += array[index].length;

      index++;

      if(index < array.length) { startLoop(id, index); }
      else { startLoop(2, 0); }
    });
  } else if(id == 2) {
    let array = spliceArray(artists_array, 50, "id");
    if(array.length == 0) {
      startLoop(3, 0);
      return;
    }
    spotifyApi.followArtists([
      array[index]
    ], function(error, data) {
      if(error) {
        uploadBar(0, "Error. Check the browser console.");
        started = false;
        return;
      }
      uploadBar(user_array.progress, "Added " + array[index].length + " artists");
      user_array.progress += array[index].length;

      index++;

      if(index < array.length) { startLoop(id, index); }
      else { startLoop(3, 0); }
    });
  } else if(id == 3) {
    let array = spliceArray(playlists_array, 1);
    if(array.length == 0) {
      uploadBar(user_array.total, "");
      started = false;
      return;
    }
    let playlist = array[index][0];
    if(playlist.owner != user_array.id) { //follow playlist that wasnt created by him
      spotifyApi.followPlaylist(playlist.owner, playlist.id, {
        public: playlist.public
      }, function(error, data) {
        if(error) {
          uploadBar(0, "Error. Check the browser console.");
          started = false;
          return;
        }
        uploadBar(user_array.progress, "Following '" + playlist.name + "' playlist");
        user_array.progress++;

        index++;

        if(index < array.length) { startLoop(id, index); }
        else {
          uploadBar(user_array.total, "");
          started = false;
        }
      });
    } else {
      spotifyApi.createPlaylist(other_array.id, { //create playlist
        public: playlist.public,
        name: playlist.name,
        collaborative: playlist.collaborative
      }, function(error, data) {
        if(error) {
          uploadBar(0, "Error. Check the browser console.");
          started = false;
          return;
        }
        let arr = spliceArray(playlist.tracks);
        for(track of arr) {
          spotifyApi.addTracksToPlaylist(other_array.id, data.id, track);
        }
        uploadBar(user_array.progress, "Creating '" + playlist.name + "' playlist");
        user_array.progress++;

        index++;

        if(index < array.length) { startLoop(id, index); }
        else {
          uploadBar(user_array.total, "");
          started = false;
        }
      });
    }
  }
}

function spliceArray(arr, limit = 100, get = "") {
  let result = [];
  let array = [];
  for(let a of arr) {
    if(!a.export) continue;
    array.push((get.length > 0) ? a[get] : a);
  }
  let len = array.length;
  for(let s = 0; s < len; s += limit) {
    let spliced = [], p = s;
    for(let p = s; p < (s+limit); p++) {
      if(p >= len) break;
      spliced.push(array[p]);
    }
    result.push(spliced);
  }
  return result;
}

window.onresize = function() {
  resizeBD()
}

function resizeBD() {
  let bd_array = document.getElementsByClassName("bd");
  let h = window.innerHeight;
  for(let bd of Array.from(bd_array)) {
    bd.style.height = (h - 450) + "px";
  }
}
