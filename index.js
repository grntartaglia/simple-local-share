'use strict';

const express = require('express');
const filesize = require('file-size');
const ip = require('ip');
const engines = require('consolidate');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.argv[2] || 3000;
const shareFolder = 'share';

function walk(dir, done) {
  let results = [];

  fs.readdir(dir, (dirErr, list) => {
    if (dirErr) return done(dirErr);

    let pending = list.length;
    if (!pending) return done(null, results);

    list.forEach((file) => {
      // Ignore .gitkeep and .DS_Store
      if (file === '.gitkeep' || file === '.DS_Store') {
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
}

app.engine('mustache', engines.mustache);

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
  walk(shareFolder, (err, data) => {
    if (err) throw err;

    data.forEach((e) => {
      const ne = e;
      ne.name = e.name.replace(shareFolder + path.sep, '');
    });

    res.render('index', { files: data });
  });
});

app.get('/download/*', (req, res, next) => {
  const file = path.join(shareFolder, req.params[0]);

  res.download(file, (err) => {
    if (!err) return true;
    if (err && err.status !== 404) return next(err);

    res.status(404).send('Cant find file, sorry!');
  });
});

app.listen(port);

console.log('Server running at %s', 'http://' + ip.address() + ':' + port);
