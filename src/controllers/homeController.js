const bookServices = require("../services/bookServices");

class HomeController {
    static async renderViewHome(req, res) {
        try {
            const { rows: books } = await bookServices.getBooksWithPagination();
            
            return res.render("index", { title: "Trang chủ", books,  });
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
        try {
            const { bookRepository, authorRepository, genreRepository, userRepository, borrowRepository, fineRepository } = require('../repositories');
            const { Fine } = require('../models');

            const [booksCount, authorsCount, genresCount, usersCount, borrowsCount] = await Promise.all([
                bookRepository.countBooks(),
                authorRepository.count(),
                genreRepository.count(),
                userRepository.count(),
                borrowRepository.count()
            ]);

            // total fines amount (sum of amount)
            const totalFines = await Fine.sum('amount') || 0;

            const stats = {
                books: booksCount || 0,
                authors: authorsCount || 0,
                genres: genresCount || 0,
                users: usersCount || 0,
                borrows: borrowsCount || 0,
                fines: totalFines || 0,
            };

            return res.render("reports/index", { title: "Bảng điều khiển", stats });
        } catch (error) {
            console.log('error render dashboard', error.message);
            return res.render("reports/index", { title: "Bảng điều khiển", stats: {} });
        }
    }
}


module.exports = HomeController;