#!/usr/bin/env node

var program = require('commander');
var eloqua = require("./eloqua");
var chalk = require('chalk');

process.title = 'eloqua-config';
program
    .option('-e --env <env>', 'Set the eloqua environment')
    .parse(process.argv);

var env = {
    dev: 'https://devlogin.eloquacorp.com',
    qa: 'https://login.elqqa01.com',
    prod: 'https://login.eloqua.com',
    scale: 'https://login.elqqa03.com',
};

if (program.env && env[program.env]) {
    eloqua.set_environment({
        name: program.env,
        login: env[program.env]
    });
}

var environment = eloqua.environment();
console.log(chalk.green(JSON.stringify(environment, null, 2)));



