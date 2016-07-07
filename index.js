#!/usr/bin/env node

var package = require('./package.json');
var program = require('commander');

process.title = 'eloqua';
program
    .version(package.version)
    .command('login', 'login into eloqua')
    .command('logout', 'clear the credentials')
    .command('app', 'app management', { isDefault: true })
    .parse(process.argv);
