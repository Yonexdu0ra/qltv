const authRoutes = require("./authRoutes");
const genreRoutes = require("./genreRoutes");
const authorRoutes = require("./authorRoutes");


function routes(app) {
    app.use('/genre', genreRoutes);
    app.use('/authors', authorRoutes);
    app.use('/auth', authRoutes);
    app.use('/books', require('./bookRoutes'));
    app.use('/borrow', require('./borrowRoutes'));
    app.use('/accounts', require('./accountRoutes'));
    app.use('/users', require('./userRoutes'));
    app.use('/', require('./homeRoutes'));
    app.use('/fines', require('./fineRoutes'));
}

module.exports = routes;


