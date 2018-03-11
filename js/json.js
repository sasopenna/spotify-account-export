function loadJSON(obj) {
  started = false;

  //obj name may be null
  if(/*!obj.name || */!obj.id || !obj.email || !obj.birthdate || !obj.imgs || !obj.url || !obj.songs || !obj.albums || !obj.artists || !obj.playlists) {
    alert("Invalid JSON file");
    return;
  }

  user_array = {
    "display_name": obj.name,
    "id": obj.id,
    "email": obj.email,
    "birthdate": obj.birthdate,
    "images": obj.imgs,
    "external_urls": {
      "spotify": obj.url
    }
  }

  let getType = [
    [songs_array, "songs"],
    [albums_array, "albums"],
    [artists_array, "artists"],
    [playlists_array, "playlists"]
  ];

  for(let g = 0; g < getType.length; g++) {
    let get = getType[g];
    let array = get[0], type = get[1];
    array.length = 0;
    for(let e = 0; e < obj[type].length; e++) {
      let el = obj[type][e];
      el.export = main_array[g];
      array.push(el);
    }
    showType(type, array);
  }

  user_array.total = 0;
  user_array.start = 0;
  user_array.tot_arr = [];
  user_array.progress = 0;

  document.getElementById("p1_birth").innerHTML = "Birthday: " + getBirthday(user_array.birthdate);
  document.getElementById("p1_email").innerHTML = "E-mail: " + user_array.email;
  document.getElementById("p1_name").innerHTML = '<a href="' + user_array.external_urls.spotify + '">' + ((user_array.display_name != null) ? user_array.display_name : user_array.id) + '</a>';
  document.getElementById("p1_img").src = (user_array.images.length) ? user_array.images[0].url : "img/noimg.png";

  document.getElementById('upload').value = "";

  showPage(4);
}

function exportJSON() {
  if(started) {
	  alert("You can't do this now.");
	  return;
  }
  if(!Object.keys(user_array).length) {
	alert("There is nothing to export.");
    started = false;
    return;
  }
  let data = {
    "name": user_array.display_name,
    "id": user_array.id,
    "email": user_array.email,
    "birthdate": user_array.birthdate,
    "imgs": user_array.images,
    "url": user_array.external_urls.spotify,
    "songs": songs_array,
    "albums": albums_array,
    "artists": artists_array,
    "playlists": playlists_array
  };

  downloadJSON(data, ((user_array.display_name != null) ? user_array.display_name : user_array.id))
}

function downloadJSON(obj, name){
  let str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
  let download = document.createElement('a');
  download.setAttribute("href", str);
  download.setAttribute("download", name + ".json");
  download.click();
  download.remove();
}
