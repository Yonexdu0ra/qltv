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
        return res.render("reports/index", { title: "Bảng điều khiển" });
    }
}


module.exports = HomeController;