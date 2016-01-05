'use strict';
var express  = require('express')
  , filesize = require('file-size')
  , ip       = require('ip')
  , fs       = require('fs')
  , path     = require('path')
  , app      = express();

var port = process.argv[2] || 3000;
var shareFolder = 'share';

function FileInfo(name, size) {
  this.name = name;
  this.size = filesize(size).human();
}

function walk(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      // Ignore .gitkeep and .DS_Store
      if (file === '.gitkeep' || file === '.DS_Store') {
        if (!--pending) return done(null, results);
      }

      file = path.join(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) return done(null, results);
          });
        } else {
          results.push(new FileInfo(file, stat.size));
          if(!--pending) return done(null, results);
        }
      });
    });
  });
}

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
  walk(shareFolder, function(err, data) {
    if (err) throw err;

    data.forEach(function(e) {
      e.name = e.name.replace(shareFolder + path.sep, '');
    });

    res.render('index', { files: data });
  });
});

app.get('/download/*', function(req, res, next) {
  var file = path.join(shareFolder, req.params[0]);

  res.download(file, function(err) {
    if (!err) return;
    if (err && err.status !== 404) return next(err);

    res.statusCode = 404;
    res.send('Cant find file, sorry!');
  });
});

app.listen(port);

console.log('Server running at %s', 'http://' + ip.address() + ':' + port);
