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

    eloqua.configure = function configure(env) {
        var environment = {
            name: env.name,
            login: env.url
        };
        storage.setItemSync('eloqua-environment', environment);
    };

    eloqua.configuration = function configuration() {
        var environment = storage.getItemSync('eloqua-environment');
        return environment ||
            {
                name: 'prod',
                login: 'https://login.eloqua.com'
            };
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