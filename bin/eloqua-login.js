#!/usr/bin/env node

var program = require('commander');
var co = require('co');
var prompt = require('co-prompt');

process.title = 'eloqua-login';
program
    .option('-c, --company <company>', 'company name')
    .option('-u, --username <username>', 'user name')
    .option('-p, --password <password>', 'password')
    .parse(process.argv);

var company = program.company;
var username = program.username;
var password = program.password;

if (company && username && password) {
    login(company, username, password);
}
else {
    co(function* () {
        company = yield prompt('company: ');
        username = yield prompt('username: ');
        password = yield prompt.password('password: ');
        login(company, username, password);
    });
}

function login(company, username, password) {
    console.log(company + "/" + username + ":" + password);
}
