(function (eloqua) {
    var storage = require('node-persist');
    storage.initSync();
    var request = require('superagent');
    var chalk = require('chalk');

    eloqua.login = function login(company, username, password) {
        var env = eloqua.environment();
        var raw = company + "\\" + username + ":" + password;
        var encoded = new Buffer(raw).toString('base64');
        var authorization = 'Basic ' + encoded;
        request
            .get(env.login + '/id')
            .set('Authorization', authorization)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err || res.body == "Not authenticated.") {
                    console.error(chalk.red(err || res.body));
                }
                else {
                    var credentials = res.body;
                    credentials.authorization = authorization;
                    credentials.base = credentials.urls.base;
                    storage.setItemSync('eloqua.' + env.name, credentials);
                    console.log(chalk.green("Welcome back " + credentials.user.displayName));
                }
            });
    };

    eloqua.logout = function logout() {
        var environment = eloqua.environment();
        var credentials = storage.getItemSync('eloqua.' + environment.name);
        if (credentials) {
            console.log(chalk.green("Good bye " + credentials.user.displayName + " from " + environment.name));
            storage.removeItemSync('eloqua.' + environment.name);
        }
        else {
            console.error(chalk.red("There is no active user"));
        }

    };

    eloqua.set_user = function user(user) {
        var environment = eloqua.environment();
        storage.setItemSync('eloqua.' + environment.name, user);
    };

    eloqua.user = function user() {
        var environment = eloqua.environment();
        var credentials = storage.getItemSync('eloqua.' + environment.name);
        if (credentials) {
            return true;
        }
        else {
            console.error(chalk.red("There is no active user on " + environment.name + ". Please login."));
            return false;
        }
    };

    eloqua.set_environment = function set_environment(env) {
        storage.setItemSync('eloqua-environment', env);
    };

    eloqua.environment = function environment() {
        var environment = storage.getItemSync('eloqua-environment');
        if (environment && environment.name) {
            return environment;
        }
        else{
            return {
                name: 'prod',
                login: 'https://login.eloqua.com'
            };
        }   
    };

    eloqua.get = function get(url, next) {
        var credentials = storage.getItemSync('eloqua');
        request
            .get(credentials.base + url)
            .set('Authorization', credentials.authorization)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err || res.body == "Not authenticated.") {
                    console.error(chalk.red(err || res.body));
                }
                else {
                    //console.log(res.body);
                    next(res.body);
                }
            });

    };

    eloqua.apps = function apps() {
        var credentials = storage.getItemSync('eloqua');
        eloqua.get('/api/cloud/1.0/apps/configurations', function (result) {
            for (var i = 0; i < result.count; i++) {
                console.log(chalk.green("[" + i + "]" + result.items[i].name));
            }
        });
    };

    eloqua.app = function app(index) {
        var credentials = storage.getItemSync('eloqua');
        eloqua.get('/api/cloud/1.0/apps/configurations?offset=' + index + '&limit=1', function (result) {
            console.log(chalk.green(JSON.stringify(result.items[0], null, 2)));
        });
    };

    eloqua.installs = function apps() {
        var credentials = storage.getItemSync('eloqua');
        console.error(chalk.red("installs"));
    };

})(module.exports);