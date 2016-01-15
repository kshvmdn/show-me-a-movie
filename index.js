#! /usr/bin/env node
'use strict';

const Promise = require('bluebird');
const colors = require('colors');
const movie = require('node-movie').getByID;
const tpb = require('thepiratebay');
const torrentStream = require('torrent-stream');

console.log('So you wanna see a movie?'.blue);
var getJSON = function(token) {
	return new Promise(function(resolve, reject) {
		movie(token, function(err, data) {
			resolve(data);
		});
	});
}

let token = process.argv[2];
getJSON(token).then(function(data) {
}).then(function(data) {
}).catch(function(e) {
	console.log(e);
});
