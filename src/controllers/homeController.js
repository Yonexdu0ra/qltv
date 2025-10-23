const { bookServices, authorServices, userServices, borrowServices, fineServices, genreServices } = require('../services');
const redis = require('../config/redisClient');
class HomeController {
    static async renderViewHome(req, res) {
        const cacheKey = "home:data";
        try {
            // await redis.flushDb();

            const cached = await redis.get(cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                // console.log('data from cache');
                return res.render("index", {
                    title: "Trang chủ",
                    books: data.booksData,
                    stats: {
                        books: data.books || 0,
                        authors: data.authors || 0,
                        genres: data.genres || 0,
                        users: data.users || 0,
                        borrows: data.borrows || 0,
                    }
                });
            }

            // console.log('data from db');
            const [
                rows,
                booksCount,
                authorsCount,
                genresCount,
                usersCount,
                borrowsCount,
            ] = await Promise.all([
                bookServices.getBooksWithAuthorsAndGenresPagination({ page: 1, limit: 12 }, { attributes: ["id", "title", "image_cover", "slug", "created_at", "description"], genreAttributes: ['id', 'name'], authorAttributes: ['id', 'name'], throughAttributes: [] }),
                bookServices.countBooks(),
                authorServices.countAuthors(),
                genreServices.countGenres(),
                userServices.countUsers(),
                borrowServices.countBorrows(),
            ]);
            const { rows: books } = rows
            const stats = {
                booksData: books,
                books: booksCount || 0,
                authors: authorsCount || 0,
                genres: genresCount || 0,
                users: usersCount || 0,
                borrows: borrowsCount || 0,
            };
            // cache 5 phút
            const TIME_CACHE = 300;
            await redis.set(cacheKey, JSON.stringify(stats), {
                EX: TIME_CACHE,
            });
            return res.render("index", { title: "Trang chủ", books, stats });
        } catch (error) {
            console.log(error.message);
            return res.render("index", { title: "Trang chủ", books: [] });
        }
    }
    static async renderViewNotFound(req, res) {
        const { error } = req.query;
        return res.render("notfound", { title: "Không tìm thấy trang", error });
    }
    static async renderViewForbidden(req, res) {
        return res.render("forbidden", { title: "Không có quyền truy cập" });
    }
    static async renderViewContact(req, res) {
        return res.render("contact", { title: "Liên hệ" });
    }
    static async renderViewDashboard(req, res) {
        const cacheKey = "dashboard:cache";
        try {
            const cached = await redis.get(cacheKey);
            if (cached) {
                // console.log('data from cache');
                return res.render("reports/index", {
                    title: "Bảng điều khiển",
                    stats: JSON.parse(cached)
                });
            }

            // console.log('data from db');

            const [
                booksCount,
                authorsCount,
                genresCount,
                usersCount,
                borrowsCount,
                totalFinesNotPaid,
            ] = await Promise.all([
                bookServices.countBooks(),
                authorServices.countAuthors(),
                genreServices.countGenres(),
                userServices.countUsers(),
                borrowServices.countBorrows(),
                fineServices.sumAmount('amount', { is_paid: false })
            ]);

            const stats = {
                books: booksCount || 0,
                authors: authorsCount || 0,
                genres: genresCount || 0,
                users: usersCount || 0,
                borrows: borrowsCount || 0,
                fines: totalFinesNotPaid || 0,
            };

            // cache 5 phút
            const TIME_CACHE = 300;
            await redis.set(cacheKey, JSON.stringify(stats), { EX: TIME_CACHE });

            return res.render("reports/index", { title: "Bảng điều khiển", stats });
        } catch (error) {
            console.log('error render dashboard', error.message);
            return res.render("reports/index", { title: "Bảng điều khiển", stats: {} });
        }
    }
}


module.exports = HomeController;