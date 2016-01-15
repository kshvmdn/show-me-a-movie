#! /usr/bin/env node
"use strict";

const Promise = require('bluebird');
const colors = require('colors');
const inquirer = require('inquirer');
const jsonfile = require('jsonfile');
const movie = require('node-movie');
const tpb = require('thepiratebay');
const torrentStream = require('torrent-stream');

console.log('So you wanna see a movie?'.blue);

