#!/usr/bin/env node

var program = require('commander');
var eloqua = require("./eloqua");

if(!eloqua.user()) return;

process.title = 'eloqua-app';
program
    .option('-l, --list', 'list apps', {isDefault: true})
    .option('-i, --index <index>', 'list installs')
    .parse(process.argv);

if (program.list) {
    eloqua.apps();
}
if (program.index) {
    eloqua.apps(program.index);
}


