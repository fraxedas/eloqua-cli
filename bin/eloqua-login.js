#!/usr/bin/env node

var program = require('commander');
var co = require('co');
var prompt = require('co-prompt');
var storage = require('node-persist');
storage.initSync();
var request = require('superagent');
var chalk = require('chalk');

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
    var raw = company + "\\" + username + ":" + password;
    var encoded = new Buffer(raw).toString('base64');
    var authorization = 'Basic ' + encoded;
    request
        .get('https://login.eloqua.com/id')
        .set('Authorization', authorization)
        .set('Accept', 'application/json')
        .end(function (err, res) {
            if (err) {
                console.error(err);
            }
            else {
                var eloqua = res.body;
                eloqua.authorization = authorization;
                eloqua.base = eloqua.urls.base;
                storage.setItem('eloqua', eloqua);
                console.log(chalk.green("Welcome back " + eloqua.user.displayName));
            }
        });
}
