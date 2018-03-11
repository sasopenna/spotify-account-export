let getAuth = [
  document.getElementById("p1_auth"),
  document.getElementById("p2_auth"),
];
let searchImg = [
  document.getElementById("p1_search"),
  document.getElementById("p2_search")
];

getAuth[0].value = token;
getAuth[0].addEventListener("keydown", function(e) {
  if (e.keyCode != 13) return;
  getP1informations();
});
searchImg[0].addEventListener("click", getP1informations);

getAuth[1].addEventListener("keydown", function(e) {
  if (e.keyCode != 13) return;
  getP2informations();
});
searchImg[1].addEventListener("click", getP2informations);

function getP2informations() {
  if (started) return;
  if (!getAuth[1].value.length) {
    searchImg[1].className = "search";
    setBar(1, "Insert an OAuth Token.", 1);
    return;
  }
  if(!Object.keys(user_array).length) {
    searchImg[1].className = "search";
    setBar(1, "You need to insert the first account.", 1);
    return;
  }

  document.getElementById("p2_birth").innerHTML = "";
  document.getElementById("p2_email").innerHTML = "";
  document.getElementById("p2_name").innerHTML = "";
  document.getElementById("p2_img").src = "img/noimg.png";
  document.getElementById("p2_console").innerHTML = "";

  setBar(1, 0);

  started = true;
  searchImg[1].className = "searching";

  spotifyApi.setAccessToken(getAuth[1].value);
  spotifyApi.getMe(function(error, data) {
    searchImg[1].className = "search";

    if (error) {
      setBar(1, "Make sure this OAuth token is correct.", 1);
      started = false;
      return;
    }

    let user = data;
    other_array = user;

    if (user.id == user_array.id) {
      setBar(1, "Can't put the same account of the first one.", 1);
      started = false;
      return;
    }

    document.getElementById("p2_birth").innerHTML = "Birthday: " + getBirthday(user.birthdate);
    document.getElementById("p2_email").innerHTML = "E-mail: " + user.email;
    document.getElementById("p2_name").innerHTML = '<a href="' + user.external_urls.spotify + '">' + ((user.display_name != null) ? user.display_name : user.id) + '</a>';
    document.getElementById("p2_img").src = (user.images.length) ? user.images[0].url : "img/noimg.png";

    otheruser = true;
    started = false;

    document.getElementById("p2_console").innerHTML = "";
    document.getElementById("convert").innerHTML = SEND_MSG;
    document.getElementById("p2_infos").style.display = "block";
  });
}

function getBirthday(string) {
  let date = string.split("-");
  let months_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return (date[2] + " " + months_array[parseInt(date[1]) - 1] + " " + date[0]);
}

function getP1informations() {
  if (started) return;
  if (!getAuth[0].value.length) {
    setBar(0, "Insert an OAuth Token.", 1);
    return;
  }

  started = true;
  otheruser = false;
  token = getAuth[0].value;

  CHECK_ID = 0;

  user_array = [];
  other_array = [];
  songs_array = [];
  albums_array = [];
  artists_array = [];
  playlists_array = [];

  document.getElementById("p1_birth").innerHTML = "";
  document.getElementById("p1_email").innerHTML = "";
  document.getElementById("p1_name").innerHTML = "";
  document.getElementById("p1_img").src = "img/noimg.png";
  document.getElementById("p1_songs").innerHTML = "";
  document.getElementById("p1_albums").innerHTML = "";
  document.getElementById("p1_artists").innerHTML = "";
  document.getElementById("p1_playlists").innerHTML = "";

  searchImg[0].className = "searching";

  spotifyApi.setAccessToken(token);
  startCheck();
}

document.getElementById("convert").addEventListener("click", function(e) {
  if (!otheruser) return;

  started = !started;

  setBar(1, 0);

  user_array.progress = 0;
  document.getElementById("p2_console").innerHTML = "";
  document.getElementById("convert").innerHTML = (!started) ? SEND_MSG : "STOP";

  if (started) {
    user_array.total = spliceArray(songs_array, 1).length + spliceArray(albums_array, 1).length + spliceArray(artists_array, 1).length + spliceArray(playlists_array, 1).length;
    startLoop();
  }
});

function gotStats(error, data) {
  user_array = {};

  document.getElementById("p1_birth").innerHTML = "";
  document.getElementById("p1_email").innerHTML = "";
  document.getElementById("p1_name").innerHTML = "Get Infos from this Account: ";
  document.getElementById("p1_img").src = "img/noimg.png";

  if (error) {
    searchImg[0].className = "search";
    setBar(0, "Make sure this OAuth token is correct.", 1);
    started = false;
    return;
  }

  user_array = data;
  user_array.total = 0;
  user_array.start = 0;
  user_array.tot_arr = [];
  user_array.progress = 0;
  getAuth[0].value = token;

  document.getElementById("p1_birth").innerHTML = "Birthday: " + getBirthday(user_array.birthdate);
  document.getElementById("p1_email").innerHTML = "E-mail: " + user_array.email;
  document.getElementById("p1_name").innerHTML = '<a href="' + user_array.external_urls.spotify + '">' + ((user_array.display_name != null) ? user_array.display_name : user_array.id) + '</a>';
  document.getElementById("p1_img").src = (user_array.images.length) ? user_array.images[0].url : "img/noimg.png";

  startCheck();
}

function showType(id, array) {
  let div = "",
    total = 0;
  for (let e = 0; e < array.length; e++) {
    let element = array[e];
    let link = 'https://open.spotify.com/' + ((element.type !== "playlist") ? (element.type + '/' + element.id) : ('user/' + element.owner + '/' + element.type + '/' + element.id));
    div += '\
    <table width="100%" class="zz">\
    <tr>\
    <td style="vertical-align: middle" rowspan="2" width="1%"><img id="' + id[2] + e + '"  onclick="selectOption(this)" src="img/' + ((element.export) ? "add" : "remove") + '.png" onmouseover="changeOver(this, ' + element.export+')" onmouseout="changeOver(this, ' + !element.export+')" width="24px" height="24px" style="cursor:pointer"></td>\
    <td rowspan="2" width="1%"><img ' + ((element.type != 'artist') ? 'class="square"' : '') + ' width="48px" height="48px" src="' + element.img + '"></td>\
    <td><a href="' + link + '">' + element.name + '</a></td>\
    </tr>\
    <tr>\
    <td class="gg">';
    if (element.artists) {
      div += '' + element.artists[0];
      for (let i = 1; i < element.artists.length; i++) {
        div += ', ' + element.artists[i];
      }
    }
    div += '</td>\
    </tr>\
    </table>';
    if (element.export) total++;
  }

  document.getElementById("p1_" + id).innerHTML = div;
  document.getElementById("p1_total" + id).innerHTML = "Total " + id + ": " + total;
}

function changeOver(parent, id) {
  parent.src = (id) ? "img/remove.png" : "img/add.png";
}

function selectOption(parent, change = -1) {
  if (started) return;

  let type = [parent.id.substring(0, 1), ""];
  let array = [];
  if (type[0] !== "m") {
    let number = parseInt(parent.id.substring(1));
    switch (type[0]) {
      case "n":
        array = songs_array;
        type[1] = "songs";
        break;
      case "b":
        array = albums_array;
        type[1] = "albums";
        break;
      case "t":
        array = artists_array;
        type[1] = "artists";
        break;
      case "a":
        array = playlists_array;
        type[1] = "playlists";
        break;
    }

    if (change == -1) {
      change = !array[number].export;
    }
    array[number].export = change;
  } else {
    type[0] = parseInt(parent.id.substring(4));
    switch (type[0]) {
      case 0:
        array = songs_array;
        type[1] = "songs";
        break;
      case 1:
        array = albums_array;
        type[1] = "albums";
        break;
      case 2:
        array = artists_array;
        type[1] = "artists";
        break;
      case 3:
        array = playlists_array;
        type[1] = "playlists";
        break;
    }

    change = !main_array[type[0]];
    main_array[type[0]] = change;

    for (let a = 0; a < array.length; a++) {
      selectOption(document.getElementById(type[1][2] + a), change);
    }
  }

  parent.onmouseover = function() { changeOver(parent, change); }
  parent.onmouseout = function() { changeOver(parent, !change); }
  parent.src = (change) ? "img/add.png" : "img/remove.png";

  document.getElementById("p1_total" + type[1]).innerHTML = "Total " + type[1] + ": " + spliceArray(array, 1, "id").length;
}

let changeMsg = (id, text) => document.getElementById(id).innerHTML = text;

document.forms[0].addEventListener('change', function(evt) {
  let file = document.getElementById('upload').files[0];
  if (started) {
    document.getElementById('upload').value = "";
    return;
  }
  if (!file) return;

  let dot = file.name.lastIndexOf(".");
  let extension = file.name.substr(dot + 1);
  if (dot == -1 || extension != "json") {
    started = false;
    alert("The file isn't JSON.");
    return;
  }
  started = true;

  document.forms[0].children[0].innerHTML = "Loading<br>" + file.name;

  let reader = new FileReader();

  user_array = [];
  songs_array = [];
  albums_array = [];
  artists_array = [];
  playlists_array = [];

  document.getElementById("p1_birth").innerHTML = "";
  document.getElementById("p1_email").innerHTML = "";
  document.getElementById("p1_name").innerHTML = "";
  document.getElementById("p1_img").src = "img/noimg.png";
  document.getElementById("p1_songs").innerHTML = "";
  document.getElementById("p1_albums").innerHTML = "";
  document.getElementById("p1_artists").innerHTML = "";
  document.getElementById("p1_playlists").innerHTML = "";

  reader.onload = (function() {
    return (e) => {
      loadJSON(JSON.parse(e.target.result))
    }
  })(file);
  reader.readAsText(file);
});
