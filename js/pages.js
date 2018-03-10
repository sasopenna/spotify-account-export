//PAGES CONFIG
let pages_names = [
  "welcome", "oauthlogin", "jsonupload", "loadinfos", "exportpage"
  //1,        2,            3,            4           5
];
let pages_array = [];
let change_pages = [];
let now_page;

const SEND_MSG = "SEND HERE";

//OPACITY CONFIG
const MAX_TIME_MS = 1000;
const TIMER_MS = 50;
const _op = TIMER_MS / MAX_TIME_MS;
let set_opacity = 0;

//script
initPages();
showPage(1);

function initPages() {
  for (let page_id = 0; page_id < pages_names.length; page_id++) {
    let page = document.getElementById(pages_names[page_id]);
    if (!page) return;
    pages_array.push(page);
  }
}

function adjustPages(page_id, prev_page) {
  if (pages_array.length == 0) return;

  for (let index = 0; index < pages_array.length; index++) {
    if (page_id == (index + 1)) pages_array[index].style.zIndex = 0;
    else if (prev_page == (index + 1) && prev_page != 0) pages_array[index].style.zIndex = 1;
    else pages_array[index].style.zIndex = -1;
  }
}

function showPage(page_id, prev_page = 0, id = 0) {
  if (started) return;
  if (Object.keys(change_pages).length != 0) return;
  if (pages_array.length == 0) return;

  adjustPages(page_id, prev_page);

  now_page = page_id;

  if (page_id == 1) { //home
    setBar(0, 0);
  } else if (page_id == 3) { //imp json
    document.getElementById('upload').value = "";
    document.forms[0].children[0].innerHTML = "Upload";
  } else if (page_id == 5) { //last pg
    setBar(1, 0);
    document.getElementById('convert').innerHTML = SEND_MSG;
    document.getElementById('p2_infos').style.display = "none";
  }

  change_pages.show = pages_array[page_id - 1];
  change_pages.hide = (prev_page != 0) ? pages_array[prev_page - 1] : undefined;

  if(id == 0) pushHistory(prev_page);

  startFade();
}

function startFade() {
  if (Object.keys(change_pages).length == 0) return;
  let this_page = change_pages.show;
  let prev_page = change_pages.hide;

  if (this_page.style.opacity < 1.0) {
    set_opacity += _op;
    if (set_opacity > 1) set_opacity = 1;

    this_page.style.opacity = set_opacity;
    if (prev_page) prev_page.style.opacity = (1 - set_opacity);

    setTimeout(startFade, TIMER_MS);
  } else {
    //finished
    set_opacity = 0;
    change_pages = {};
    this_page.style.zIndex = 1;
    if (prev_page) prev_page.style.zIndex = 0;
  }
}
