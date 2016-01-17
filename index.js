#! /usr/bin/env node
'use strict';

const Promise = require('bluebird');
const colors = require('colors');
const movie = require('node-movie').getByID;
const spawn = require('child_process').spawn;
const tpb = require('thepiratebay');
const torrentStream = require('torrent-stream');

var getJSON = function(token) {
	return new Promise(function(resolve, reject) {
		if (token == undefined) reject(new Error('token not supplied'))
		movie(token, function(err, data) {
			if (data == null) reject(new Error('invalid request'));
			if (data.Response == 'False') reject(new Error('invalid token'));
			if (data.Type != 'movie') reject(new Error('invalid type'));
			resolve(data);
		});
	});
}

var getTorrent = function(movieTitle) {
	return new Promise(function(resolve, reject) {
		tpb.search(movieTitle, { 
			category: '201' 
		})
		.then(function(results) { resolve(results); })
		.catch(function(err) { reject(err); });
	});
}

var parseTorrent = function(torrentData) {
	// console.log(torrentData);
	let engine = torrentStream(torrentData.magnetLink);
	let args = [torrentData.magnetLink, '--vlc'];

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
		if (err.code == 'ENOENT') throw new Error('Peerflix not installed globably');
		else throw err;
	});
	cmd.stdout.pipe(process.stdout);
	cmd.stderr.pipe(process.stdout);
}

let imdbToken = process.argv[2];
getJSON(imdbToken).then(function(data) {
	console.log('So you want to see %s? ' + 'Loading stream...', String(data.Title).yellow);
	return getTorrent(data.Title);
}).then(function(results) {
	// TODO add handling for multiple files in single magnet
	var args = [results[0].magnetLink, '--vlc', '--fullscreen'];
	playMagnet(args);
}).catch(function(e) {
	console.log(e);
});
