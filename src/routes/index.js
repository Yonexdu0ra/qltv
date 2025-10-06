const loginRoutes = require("./loginRoutes");
const genreRoutes = require("./genreRoutes");
const authorRoutes = require("./authorRoutes");


function routes(app) {

    app.use('/genre', genreRoutes);
    app.use('/author', authorRoutes);
    app.use('/auth', loginRoutes);

}

module.exports = routes;


