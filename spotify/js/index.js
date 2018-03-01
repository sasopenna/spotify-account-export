let token = "";
let spotifyApi = new SpotifyWebApi();

let songs_array = [];
let artists_array = [];
let albums_array = [];
let user_array = [];
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

  footerDiv.style.display = "none";
  contentDiv.style.display = "none";
  token = getAuth[0].value;
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

resizeBD();

function startCheck(id = 0) {
  if(id >= 4) return;

  if(id == 0)       spotifyApi.getMe(getStats);
  else if(id == 1)  spotifyApi.getMySavedTracks({limit: 1}, getSavedTracks);
  else if(id == 2)  spotifyApi.getMySavedAlbums({limit: 1}, getSavedAlbums);
  else if(id == 3)  spotifyApi.getFollowedArtists({limit: 1}, getSavedArtists);
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
  document.getElementById("p1_name").innerHTML = "";
  document.getElementById("p1_img").src = "img/noimg.jpg";

  user_array = data;
  user_array.total = 0;
  user_array.start = 0;
  getAuth[0].value = token;

  document.getElementById("p1_birth").innerHTML = "Birthday: " + user_array.birthdate;
  document.getElementById("p1_email").innerHTML = "E-mail: " + user_array.email;
  document.getElementById("p1_name").innerHTML = '<a href="' + user_array.external_urls.spotify + '">' + user_array.display_name + '</a>';
  document.getElementById("p1_img").src = (user_array.images.length) ? user_array.images[0].url : "img/noimg.jpg";

  startCheck(1);
}

function getSavedTracks(error, data) {
  if(error) { started = false; return; }

  let maxsongs = data.total;
  user_array.total += maxsongs;

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


function getSavedArtists(error, data) {
  if(error) { started = false; return; }

  let maxartists = data.artists.total;
  user_array.total += maxartists;

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
          started = false;
          contentDiv.style.display = "block";
          footerDiv.style.display = "block";
          //showSongs();
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
  for(element of array) {
    div += '\
    <table width="100%" class="zz">\
    <tr>\
    <td rowspan="2" width="1%">\
    <img ' + ((element.type != 'artist') ? 'class="square"': '') + ' width="48px" height="48px" src="' + element.img + '">\
    </td>\
    <td>\
    <a href="https://open.spotify.com/' + element.type + '/' + element.id + '">' + element.name + '</a>\
    </td>\
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

window.onresize = function() {
  resizeBD()
}

function resizeBD() {
  let bd_array = document.getElementsByClassName("bd");
  let h = window.innerHeight;
  for(let bd of Array.from(bd_array)) {
    bd.style.height = (h - 412) + "px";
  }
}

/////altro

function uploadBar(index_length, cons) {
  let divide = ((index_length/user_array.total) * 100).toFixed(2);
  if(divide > 100.00) divide = 100.00;

  percentDiv[1].style.width = divide + "%";
  percentDiv[1].innerHTML = divide + "%";

  let div = document.getElementById("p2_console").innerHTML;

  if(cons.length > 0) {
    div = '<div class="cc">Added ' + cons + '</div>' + div;
  } else {
    div = '<div class="cc">Finished. 100%</div>' + div;
  }
  document.getElementById("p2_console").innerHTML = div;
}

document.getElementById("convert").addEventListener("click", function(e) {
  if(!otheruser || started) return;
  startLoop();
});

function startLoop(id = 0, index = 0) {
  started = true;

  if(id == 0) {
    spotifyApi.addToMySavedTracks({
      ids: [
        songs_array[index].id
      ]
    }, function(error, data) {
      uploadBar(index, "song " + songs_array[index].name);

      index++;

      if(index < songs_array.length) { startLoop(id, index); }
      else { startLoop(1, 0); }
    });
  } else if(id == 1) {
    spotifyApi.addToMySavedAlbums({
      ids: [
        albums_array[index].id
      ]
    }, function(error, data) {
      uploadBar(songs_array.length + index, "album " + albums_array[index].name);

      index++;

      if(index < albums_array.length) { startLoop(id, index); }
      else { startLoop(2, 0); }
    });
  } else if(id == 2) {
    spotifyApi.followArtists(artists_array[index].id, function(error, data) {
      uploadBar(songs_array.length + albums_array.length + index, "artist " + artists_array[index].name);

      index++;

      if(index < artists_array.length) { startLoop(id, index); }
      else {
        started = false;
        uploadBar(songs_array.length + albums_array.length + artists_array.length, "");
      }
    });
  }
}
