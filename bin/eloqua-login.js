#!/usr/bin/env node

var program = require('commander');

process.title = 'eloqua-app';
program
    .option('-l, --list', 'List installed apps')
    .option('-a, --apps', 'List apps developed by you')
    .parse(process.argv);
