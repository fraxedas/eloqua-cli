(function (eloqua) {
    var storage = require('node-persist');
    storage.initSync();
    var request = require('superagent');
    var chalk = require('chalk');

    eloqua.login = function login(company, username, password) {
        var raw = company + "\\" + username + ":" + password;
        var encoded = new Buffer(raw).toString('base64');
        var authorization = 'Basic ' + encoded;
        request
            .get('https://login.eloqua.com/id')
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
                    storage.setItemSync('eloqua', credentials);
                    console.log(chalk.green("Welcome back " + credentials.user.displayName));
                }
            });
    };

    eloqua.logout = function logout() {
        var credentials = storage.getItemSync('eloqua');
        if (credentials) {
            console.log(chalk.green("Login out " + credentials.user.displayName));
            storage.removeItemSync('eloqua');
        }
        else {
            console.error(chalk.red("There is no active user"));
        }

    };

    eloqua.user = function user() {
        var credentials = storage.getItemSync('eloqua');
        if (credentials) {
            return true;
        }
        else {
            console.error(chalk.red("There is no active user. Please login."));
            return false;
        }

    };

    eloqua.apps = function apps(index) {
        var credentials = storage.getItemSync('eloqua');
        var offset = index || 0;
        var limit = index ? 1 : 100;
        request
            .get(credentials.base + '/api/cloud/1.0/apps/configurations?offset=' + offset + '&limit=' + limit)
            .set('Authorization', credentials.authorization)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err) {
                    console.error(chalk.red(err));
                }
                else {
                    var apps = res.body.items;
                    for (var i = 0; i < apps.length; i++) {
                        var app = apps[i];
                        if (index) {
                            console.log(app);
                        }
                        else {
                            console.log(chalk.green("[" + i + "]" + app.name));
                        }
                    }
                }
            });

    };

    eloqua.installs = function apps() {
        var credentials = storage.getItemSync('eloqua');
        console.error(chalk.red("installs"));
    };

})(module.exports);