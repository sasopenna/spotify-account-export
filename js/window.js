function resizeBD() {
  let bd_array = document.getElementsByClassName("bd"), h = (window.innerHeight - 500);
  for(let bd of Array.from(bd_array)) {
    bd.style.height = h + "px";
  }
}

function previousPage(e) {
  if (started) return;
  if (Object.keys(change_pages).length != 0) return;
  if(now_page == 1) return;

  let stat = e.state;
  if(!stat) return;

  showPage(stat.page, now_page, -1);
}

function pushHistory(this_page) {
  if(this_page == 0) return;
  history.pushState({
    page: this_page,
  }, document.title);
  history.pushState(null, null);
  history.replaceState(null, document.title);
}

window.onload = resizeBD;
window.onresize = resizeBD;
window.onpopstate = previousPage;
