#!/usr/bin/env node

var program = require('commander');
var eloqua = require("./eloqua");

process.title = 'eloqua-logout';
program
    .parse(process.argv);

eloqua.logout();
