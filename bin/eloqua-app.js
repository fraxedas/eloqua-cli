#!/usr/bin/env node

var program = require('commander');
var eloqua = require("./eloqua");

if(!eloqua.user()) return;

process.title = 'eloqua-app';
program
    .option('-l, --list', 'list apps')
    .option('-i, --index <index>', 'display specific app')
    .parse(process.argv);

if (program.index) {
    eloqua.app(program.index);
}
else if (program.list) {
    eloqua.apps();
}
else{
    eloqua.apps();
} 


