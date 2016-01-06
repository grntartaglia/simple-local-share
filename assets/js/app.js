'use strict';
var filesEl    = document.getElementById('files')
  , notFoundEl = document.getElementById('not-found')
  , searchEl   = document.getElementById('search');

function filterFiles(s) {
  var items = document.getElementsByClassName('file-item');
  var len = items.length;
  var files = [];

  for (var i = 0; i < len; i++) {
    var item = items[i];
    var name = item.dataset.name;

    item.hidden = name.indexOf(s) === -1;

    if (!item.hidden) files.push(item);
  }

  var found = files.length > 0;

  filesEl.hidden = !found;
  notFoundEl.hidden = found;

  return files;
}

function onsearch(evt) {
  var s = evt.target.value;
  filterFiles(s);
}

searchEl.addEventListener('change', onsearch);
searchEl.addEventListener('keyup', onsearch);

filterFiles('');
