'use strict';

const fs = require('fs');
const path = require('path');
const filesize = require('file-size');

module.exports = function walk(dir, done) {
  let results = [];

  fs.readdir(dir, (dirErr, list) => {
    if (dirErr) return done(dirErr);

    let pending = list.length;
    if (!pending) return done(null, results);

    list.forEach((file) => {
      // Ignore .gitignore and .DS_Store
      if (file === '.gitignore' || file === '.DS_Store') {
        if (!--pending) return done(null, results);
        return false;
      }

      const filePath = path.join(dir, file);

      fs.stat(filePath, (statErr, stat) => {
        if (stat && stat.isDirectory()) {
          walk(filePath, (err, res) => {
            results = results.concat(res);
            if (!--pending) return done(null, results);
          });
        } else {
          const name = filePath;
          const size = filesize(stat.size).human();

          results.push({ name, size });
          if (!--pending) return done(null, results);
        }
      });
    });
  });
};
