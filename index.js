'use strict';

const express = require('express');
const ip = require('ip');
const engines = require('consolidate');
const path = require('path');
const walk = require('./lib/walk');
const app = express();
const port = process.argv[2] || 3000;
const shareFolder = 'share';

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
