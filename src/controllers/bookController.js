const BookService = require("../services/bookServices");
class BookController {
    static async renderViewBooks(req, res) {
        try {

            const books = await BookService.getBooksWithAuthorsAndGenresPagination({ ...req.query });
            return res.json({
                success: true,
                data: books
            })
        } catch (error) {
            console.error("❌ Sequelize error:", error.message);
            console.error("🧩 SQL:", error.sql);   // thêm dòng này
        }
    }
    static async renderViewCreateBook(req, res) { }
    static async renderViewEditBook(req, res) { }
    static async renderViewDeleteBook(req, res) { }
    static async renderViewDetailBook(req, res) { }

    static async handleCreateBook(req, res) {
        const image = req.file?.path || null;
        const body = req.body || {};
        try {
            const data = await BookService.createBook({ ...body, image_cover: image });
            return res.json({ success: true, data });
        } catch (error) {
            console.log(error);

            return res.json({ success: false, message: error.message });
        }
    }
    static async handleEditBook(req, res) {
        const image = req.file?.path || null;
        const body = req.body || {};
        const id = req.params.id
        try {
            const data = await BookService.updateBook(id, { ...body, image_cover: image });
            return res.json({ success: true, data });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    }
    static async handleDeleteBook(req, res) {
        try {
            const data = await BookService.deleteBook(req.params.id);
            return res.json({ success: true, data });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    }

}

module.exports = BookController;