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

let token = process.argv[2];
getJSON(token).then(function(data) {
	console.log('So you want to see %s? ' + 'Loading stream...', String(data.Title).yellow);
	return data;
}).then(function(data) {
}).catch(function(e) {
	console.log(e);
});
