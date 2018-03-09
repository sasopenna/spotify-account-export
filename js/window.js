function resizeBD() {
  let bd_array = document.getElementsByClassName("bd"), h = window.innerHeight;
  for(let bd of Array.from(bd_array)) {
    bd.style.height = (h - 500) + "px";
  }
}

window.onload = resizeBD;
window.onresize = resizeBD;
