const loginRoutes = require("./loginRoutes");
const genreRoutes = require("./genreRoutes");
const authorRoutes = require("./authorRoutes");


function routes(app) {

    app.use('/genre', genreRoutes);
    app.use('/authors', authorRoutes);
    app.use('/auth', loginRoutes);
    app.use('/books', require('./bookRoutes'));
    app.use('/borrow', require('./borrowRoutes'));
}

module.exports = routes;


