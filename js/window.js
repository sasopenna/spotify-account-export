function resizeBD() {
  let bd_array = document.getElementsByClassName("bd"),
      h = ((window.innerHeight - 500) < 70) ? 70 : (window.innerHeight - 500);

  for(let bd of Array.from(bd_array)) {
    bd.style.height = h + "px";
  }
}

function previousPage(e) {
  if(now_page <= 1) return;
  let stat = e.state;

  if(started || Object.keys(change_pages).length != 0) {
    if(stat && stat.page) history.pushState({ page: stat.page }, document.title);
    return;
  }

  if(!stat) return;
  if(!stat.page) return;

  showPage(stat.page, -1);
}

function pushHistory(this_page) {
  if(!this_page || this_page == 0) return;
  history.pushState({ page: this_page }, document.title);
}

let goBack = () => window.history.back();

window.onload = resizeBD;
window.onresize = resizeBD;
window.onpopstate = previousPage;
