

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
const borrowDetailRoutesPublic = require('./public/borrowDetailRoutes');
const borrowDetailRoutesPrivate = require('./private/borrowDetailRoutes');
const fineRoutesPrivate = require('./private/fineRoutes');
const homeRoutesPublic = require('./public/homeRoutes');
const homeRoutesPrivate = require('./private/homeRoutes');
const userRoutesPrivate = require('./private/userRoutes');
const { requiredRoleLibrarianAndAdmin, requiredRoleAdmin } = require("../middleware/authorizationMiddleware");
function routes(app) {

    app.use('/genres', genreRoutesPublic);
    app.use('/authors', authorRoutesPublic);
    app.use('/books', bookRoutesPublic);
    app.use('/auth', authRoutesPublic);
    app.use('/', homeRoutesPublic)

    // cấu hình phải đăng nhập mới được truy cập và quyền admin, thủ thư
    app.use('/dashboard/borrows/', borrowRoutesPrivate);
    app.use('/dashboard/genres/', requiredRoleLibrarianAndAdmin, genreRoutesPrivate);
    app.use('/dashboard/authors/', requiredRoleLibrarianAndAdmin, authorRoutesPrivate);
    app.use('/dashboard/books/', requiredRoleLibrarianAndAdmin, bookRoutesPrivate);
    app.use('/dashboard/users/', requiredRoleLibrarianAndAdmin, userRoutesPrivate);

    // phải đăng nhập và quyền admin
    app.use('/dashboard/accounts/', requiredRoleAdmin, accountRoutesPrivate);

    // phải đăng nhập nhưng có 1 số chức năng không cần quyền admin

    app.use('/dashboard/borrow-details/', borrowDetailRoutesPublic);
    app.use('/dashboard/borrow-details/', borrowDetailRoutesPrivate);
    // app.use('/dashboard/borrow-details/', borrowDetailRoutesPrivate);
    app.use('/dashboard/fines/', fineRoutesPrivate);

    app.use('/dashboard', requiredRoleLibrarianAndAdmin, homeRoutesPrivate);
    app.use('/auth', authRoutesPrivate);
    app.use((req, res) => {
        return res.redirect('/not-found');
    })
}
module.exports = routes;


