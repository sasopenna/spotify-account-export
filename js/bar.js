let percentDiv = [
  document.getElementById("p1_bar"),
  document.getElementById("p2_bar")
];

function setBar(id, percent, error = 0) {
  if(error == 0) {
	   let text_percent = percent.toFixed(2) + "%";
    percentDiv[id].style.background = "#18642f";
    percentDiv[id].style.width = text_percent;
    percentDiv[id].innerHTML = (percent > 0) ? text_percent : "";
  } else {
    percentDiv[id].style.background = "#FF0000";
    percentDiv[id].style.width = "100.00%";
    percentDiv[id].innerHTML = percent;
  }
}


function updateBar(add = 1) {
  if((user_array.start + add) <= user_array.total) user_array.start += add;
  else user_array.start = user_array.total;

  let divide = ((user_array.start/user_array.total) * 100);
  setBar(0, divide);
}

function uploadBar(index_length, cons) {
  if(!started) return;
  let divide = ((index_length + 1)/(user_array.total + 1)) * 100;
  if(divide >= 100) {
    divide = 100;
    document.getElementById("convert").innerHTML = SEND_MSG;
  }

  setBar(1, divide);

  let div = document.getElementById("p2_console").innerHTML;
  div = '<span class="cc">' + ((divide < 100) ? cons : 'Finished. 100%') + '</span><br>' + div;
  document.getElementById("p2_console").innerHTML = div;
}
