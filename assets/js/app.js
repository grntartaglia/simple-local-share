'use strict';

var filesEl = document.getElementById('files');
var notFoundEl = document.getElementById('not-found');
var searchEl = document.getElementById('search');

function filterFiles(s) {
  var items = document.getElementsByClassName('file-item');
  var len = items.length;
  var files = [];
  var i;
  var item;
  var name;
  var found;

  for (i = 0; i < len; i++) {
    item = items[i];
    name = item.dataset.name;

    item.hidden = name.indexOf(s) === -1;

    if (!item.hidden) files.push(item);
  }

  found = files.length > 0;

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
