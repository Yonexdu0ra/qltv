const bookServices = require("../services/bookServices");

class HomeController {
    static async renderViewHome(req, res) {
        try {
            const { rows: books } = await bookServices.getBooksPagination();
            
            return res.render("index", { title: "Trang chủ", books });
        } catch (error) {
            console.log(error.message);
            
            return res.render("index", { title: "Trang chủ", books: [] });

        }
    }
}


module.exports = HomeController;