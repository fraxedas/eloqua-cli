#!/usr/bin/env node

var program = require('commander');
var eloqua = require("./eloqua");
var chalk = require('chalk');

process.title = 'eloqua-config';
program
    .option('-e --env <env>', 'Eloqua environment', /^(dev|qa|prod|custom)$/i, 'prod')
    .parse(process.argv);

if (program.env) {
    eloqua.configure(program.env);
}

var environment = eloqua.configuration();
console.log(chalk.green(JSON.stringify(environment, null, 2)));



