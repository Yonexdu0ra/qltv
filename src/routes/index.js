

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
const userRoutesPrivate = require('./private/userRoutes');
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const { requiredRoleLibrarianAndAdmin, requiredRoleAdmin } = require("../middleware/authorizationMiddleware");
function routes(app) {

    app.use('/genres', genreRoutesPublic);
    app.use('/authors', authorRoutesPublic);
    app.use('/books', bookRoutesPublic);
    app.use('/auth', authRoutesPublic);
    app.use('/', homeRoutes)

    // cấu hình phải đăng nhập mới được truy cập và quyền admin, thủ thư
    app.use('/dashboard/genres/', authenticationMiddleware, requiredRoleLibrarianAndAdmin, genreRoutesPrivate);
    app.use('/dashboard/authors/', authenticationMiddleware, requiredRoleLibrarianAndAdmin, authorRoutesPrivate);
    app.use('/dashboard/books/', authenticationMiddleware, requiredRoleLibrarianAndAdmin, bookRoutesPrivate);
    app.use('/dashboard/users/', authenticationMiddleware, requiredRoleLibrarianAndAdmin, userRoutesPrivate);

    // phải đăng nhập và quyền admin
    app.use('/dashboard/accounts/', authenticationMiddleware,requiredRoleAdmin,  accountRoutesPrivate);

    // phải đăng nhập nhưng có 1 số chức năng không cần quyền admin
    app.use('/dashboard/borrows/', authenticationMiddleware, borrowRoutesPrivate);
    app.use('/dashboard/borrow-details/', authenticationMiddleware, borrowDetailRoutesPrivate);
    app.use('/dashboard/fines/', authenticationMiddleware, fineRoutesPrivate);

    app.use('/auth', authenticationMiddleware, authRoutesPrivate);
}

module.exports = routes;


