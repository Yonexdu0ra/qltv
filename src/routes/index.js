

const genreRoutesPrivate = require('./private/genreRoutes');
const genreRoutesPublic = require('./public/genreRoutes');

const authorRoutesPrivate = require('./private/authorRoutes');
const authorRoutesPublic = require('./public/authorRoutes');

const authRoutesPublic = require('./public/authRoutes');
const authRoutesPrivate = require('./private/authRoutes');

const bookRoutesPublic = require('./public/bookRoutes');
const bookRoutesPrivate = require('./private/bookRoutes');

const accountRoutesPrivate = require('./private/accountRoutes');
const borrowRoutesPrivate = require('./private/borrowRoutes');
const borrowDetailRoutesPrivate = require('./private/borrowDetailRoutes');
const fineRoutesPrivate = require('./private/fineRoutes');
const homeRoutes = require('./public/homeRoutes');
function routes(app) {
    app.use('/auth', authRoutesPublic);
    app.use('/auth', authRoutesPrivate);
    app.use('/', homeRoutes)
    app.use('/genre', genreRoutesPrivate);
    app.use('/authors', accountRoutesPrivate);
}

module.exports = routes;


