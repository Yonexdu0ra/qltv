const loginRoutes = require("./loginRoutes");
const genreRoutes = require("./genreRoutes");



function routes(app) {

    app.use('/genre', genreRoutes);
    app.use('/auth', loginRoutes);

}

module.exports = routes;


