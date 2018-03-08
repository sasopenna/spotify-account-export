let getAuth = [
  document.getElementById("p1_auth"),
  document.getElementById("p2_auth"),
];
let percentDiv = [
  document.getElementById("p1_bar"),
  document.getElementById("p2_bar")
];
let searchImg = [
  document.getElementById("p1_search"),
  document.getElementById("p2_search")
];
let jsonLabels = document.getElementsByClassName("upload");
let contentDiv = document.getElementById("content");
let footerDiv = document.getElementById("footer");

getAuth[0].value = token;
getAuth[0].addEventListener("keydown", function(e) {
  if(e.keyCode != 13) return;
  getP1informations();
});
searchImg[0].addEventListener("click", getP1informations);

getAuth[1].addEventListener("keydown", function(e) {
  if(e.keyCode != 13) return;
  getP2informations();
});
searchImg[1].addEventListener("click", getP2informations);

function getP2informations() {
  if(started) return;
  if(!Object.keys(user_array).length) {
    searchImg[1].className = "search";
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
  searchImg[1].className = "searching";

  spotifyApi.setAccessToken(getAuth[1].value);
  spotifyApi.getMe(function(error, data) {
    searchImg[1].className = "search";

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
    document.getElementById("p2_name").innerHTML = 'Send Infos to this Account: <a href="' + user.external_urls.spotify + '">' + ((user.display_name != null) ? user.display_name : user.id) + '</a>';
    document.getElementById("p2_img").src = (user.images.length) ? user.images[0].url : "img/noimg.jpg";

    otheruser = true;
    started = false;
  });
}

function getP1informations() {
  if(started) return;
  if(!getAuth[0].value.length) {
    percentDiv[0].style.background = "#FF0000";
    percentDiv[0].style.width = "100%";
    percentDiv[0].innerHTML = "Insert an OAuth Token.";
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

  searchImg[0].className = "searching";

  footerDiv.style.display = "none";
  contentDiv.style.display = "none";
  spotifyApi.setAccessToken(token);

  startCheck();
}

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

function gotStats(error, data) {
  if(error) {
    searchImg[0].className = "search";
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
  user_array.tot_arr = [];
  user_array.progress = 0;
  getAuth[0].value = token;

  document.getElementById("p1_birth").innerHTML = "Birthday: " + user_array.birthdate;
  document.getElementById("p1_email").innerHTML = "E-mail: " + user_array.email;
  document.getElementById("p1_name").innerHTML = 'Get Infos from this Account: <a href="' + user_array.external_urls.spotify + '">' + ((user_array.display_name != null) ? user_array.display_name : user_array.id) + '</a>';
  document.getElementById("p1_img").src = (user_array.images.length) ? user_array.images[0].url : "img/noimg.jpg";

  document.getElementById('upload').value = "";
  jsonLabels[0].innerText = "Upload JSON";

  startCheck();
}

function showType(id, array) {
  let div = "", total = 0;
  for(let e = 0; e < array.length; e++) {
    let element = array[e];
    let link = 'https://open.spotify.com/' + ((element.type !== "playlist") ? (element.type + '/' + element.id) : ('user/' + element.owner + '/' + element.type + '/' + element.id));
    div += '\
    <table width="100%" class="zz">\
      <tr>\
        <td style="vertical-align: middle" rowspan="2" width="1%"><img id="' + id[2] + e + '"  onclick="selectOption(this)" src="img/' + ((element.export) ? "add" : "remove") + '.png" onmouseover="changeOver(this, ' + element.export + ')" onmouseout="changeOver(this, ' + !element.export + ')" width="24px" height="24px" style="cursor:pointer"></td>\
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
    if(element.export) total++;
  }

  document.getElementById("p1_" + id).innerHTML = div;
  document.getElementById("p1_total" + id).innerHTML = "Total " + id + ": " + total;
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

function updateBar(add = 1) {
  if((user_array.start + add) <= user_array.total) user_array.start += add;
  else user_array.start = user_array.total;

  let divide = ((user_array.start/user_array.total) * 100).toFixed(2) + "%";
  percentDiv[0].style.width = divide;
  percentDiv[0].innerHTML = divide;
}

function uploadBar(index_length, cons) {
  if(!started) return;
  let divide = ((index_length + 1)/(user_array.total + 1)) * 100;
  if(divide >= 100) {
    divide = 100;
    document.getElementById("convert").innerHTML = "Send Here";
  }

  percentDiv[1].style.width = divide.toFixed(2) + "%";
  percentDiv[1].innerHTML = (divide > 0) ? (divide.toFixed(2) + "%") : "";

  let div = document.getElementById("p2_console").innerHTML;
  div = '<span class="cc">' + ((divide < 100) ? cons : 'Finished. 100%') + '</span><br>' + div;
  document.getElementById("p2_console").innerHTML = div;
}

jsonLabels[1].addEventListener('click', exportJSON);

document.forms[0].addEventListener('change', function(evt) {
  let file = document.getElementById('upload').files[0];
  if(started) {
    document.getElementById('upload').value = "";
    jsonLabels[0].innerText = "Upload JSON";
    return;
  }
  if(!file) return;
  started = true;

  let reader = new FileReader();

  jsonLabels[0].innerText = file.name;

  let dot = file.name.lastIndexOf(".");
  let extension = file.name.substr(dot + 1);
  if(dot == -1 || extension != "json") {
    started = false;
    percentDiv[0].style.background = "#FF0000";
    percentDiv[0].style.width = "100.00%";
    percentDiv[0].innerHTML = "The file isn't JSON.";
    return;
  }

  user_array = [];
  //other_array = [];
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

  percentDiv[0].innerHTML = "";
  percentDiv[0].style.width = "0%";
  percentDiv[0].style.background = "#1db954";

  footerDiv.style.display = "none";
  contentDiv.style.display = "none";

  reader.onload = (function() { return (e) => { loadJSON(JSON.parse(e.target.result)) }})(file);
  reader.readAsText(file);
});
