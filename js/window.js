
function resizeBD() {
  let bd_array = document.getElementsByClassName("bd");
  let h = window.innerHeight;
  for(let bd of Array.from(bd_array)) {
    bd.style.height = (h - 450) + "px";
  }
}
window.onload = resizeBD;
window.onresize = resizeBD;
