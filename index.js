#! /usr/bin/env node
'use strict';

const Promise = require('bluebird');
const colors = require('colors');
const movie = require('node-movie').getByID;
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

var getStream = function(magnet) {
	var engine = torrentStream('magnet:' + magnet);
	engine.on('ready', function() {
		engine.files.forEach(function(file) {
			console.log('filename:', file.name);
			var stream = file.createReadStream();
		});
	});
}

let token = process.argv[2];
getJSON(token).then(function(data) {
	console.log('So you want to see %s? ' + 'Loading stream...', String(data.Title).yellow);
	return getTorrent(data.Title);
}).then(function(results) {
	getStream(results[0].magnetLink);
}).catch(function(e) {
	console.log(e);
});
