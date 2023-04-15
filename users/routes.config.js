const UsersController = require('./controllers/users.controller');


exports.routesConfig = function (app) {
    app.get('/', [
        UsersController.default
    ]);
    app.post('/signup', [
        UsersController.insert
    ]);
    app.get('/users/:userId', [
        UsersController.getById
    ]);
    app.patch('/users/:userId', [
        UsersController.patchById
    ]);
    app.post('/close/:userId', [
        UsersController.removeById
    ]);
};
