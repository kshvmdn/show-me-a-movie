'use strict';

const Promise = require('bluebird');
const colors = require('colors');
const movie = require('node-movie').getByID;
const spawn = require('child_process').spawn;
const tpb = require('thepiratebay');
const torrentStream = require('torrent-stream');

const tokens = require('../src/tokens');
const randToken = require('unique-random')(0, tokens.length);

var getToken = function() {
  return new Promise(function(resolve, reject) {
    resolve(process.argv[2] == null ? tokens[randToken()] : process.argv[2]);
  });
}


var getTorrent = function(movieTitle) {
  return new Promise(function(resolve, reject) {
    tpb.search(movieTitle, {
      category: '201'
    })
    .then(results => {
      if (results.length == 0) {
      }
      resolve(results);
    })
    .catch(err => {
      reject(new Error(err));
    });
  });
}

var getMagnet = function(torrentData) {
  let i = 0, magnet;
  while (magnet == undefined)
    magnet = torrentData[i].magnetLink; i++;

  let engine = torrentStream(magnet);
  let args = [magnet, '--vlc'];

  return new Promise(function(resolve, reject) {
    engine.on('ready', function() {
      var file = { 'fileIndex': 0, 'size': engine.files[0].length };
      if (engine.files.length > 1){
        console.log('> ' + 'Multiple files in magnet. Processing data...'.yellow)
        engine.files.forEach(function(f, i) {
          if (f.length > file.size) {
            file.fileIndex = i;
            file.size = f.length;
          }
        });
        args.push('--index=' + file.fileIndex)
      }
      resolve(args);
    });
  });
}

var playMovie = function(args) {
  let cmd = spawn('peerflix', args).on('error', function(err) {
    else throw err;
  });
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stdout);
}

module.exports = {
  getToken: getToken,
  getData: getJSON,
  getTorrent: getTorrent,
  getMagnet: getMagnet,
  playMovie: playMovie
}
