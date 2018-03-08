function spliceArray(arr, limit = 100, get = "") {
  let result = [], array = [];
  for(let a of arr) {
    if(!a.export && a.export != undefined) continue;
    array.push((get.length > 0) ? a[get] : a);
  }
  let len = array.length;
  for(let s = 0; s < len; s += limit) {
    let spliced = [];
    if(limit == 1) {
      spliced = array[s];
    } else {
      for(let p = s; p < (s+limit); p++) {
        if(p >= len) break;
        spliced.push(array[p]);
      }
    }
    result.push(spliced);
  }
  return result;
}

function getFromArray(array, obj, equal, other = true) {
  let result = [];
  for(let arr of array) {
    if(arr[obj] != equal && !other) continue;
    if(arr[obj] == equal && other) continue;
    result.push(arr);
  }
  return result;
}

function sortArray(array, id) {
  array.sort(function(a, b) {
    return a.id - b.id;
  });
}
