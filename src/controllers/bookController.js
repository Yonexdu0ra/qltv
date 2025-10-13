const BookService = require("../services/bookServices");
const encodeBase64 = require("../utils/base64");

class BookController {
    static async renderViewBooks(req, res) {
        try {
            const limit = req.query.limit ? req.query.limit > 0 ? parseInt(req.query.limit) : 5 : 5
            const { rows: books, count: totals } = await BookService.getBooksPagination({ ...req.query, limit });
            const totalPages = Math.ceil(totals / limit);
            const page = parseInt(req.query.page) || 1;
            return res.render("books/index", { books, totals: totalPages, page, query: req.query, title: "Quản lý sách" });
        } catch (error) {
            return res.render("books/index", { books: [], totals: 0, page: 1, error: error.message, query: req.query, title: "Quản lý sách" });
        }
    }
    static async renderViewCreateBook(req, res) {
        try {

            return res.render("books/add", { title: "Thêm sách" });
        } catch (error) {
            return res.redirect('not-found?error=' + encodeBase64(error.message))
        }
    }
    static async renderViewEditBook(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Sách không tồn tại không thể sửa");
            const book = await BookService.getBookByIdWithAuthorAndGenre(id);
            if (!book) throw new Error("Sách không tồn tại không thể sửa");
            return res.render("books/edit", { book, title: "Sửa sách" });
        } catch (error) {
            return res.redirect('/books?error=' + encodeBase64(error.message))
        }
    }
    static async renderViewDeleteBook(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Sách không tồn tại không thể xóa");
            const book = await BookService.getBookById(id);
            if (!book) throw new Error("Sách không tồn tại không thể sửa");
            return res.render("books/delete", { book, title: "Xóa sách" });
        } catch (error) {
            return res.redirect('/books?error=' + encodeBase64(error.message))
        }
    }
    static async renderViewDetailBook(req, res) {
        try {
            const book = await BookService.getBookByIdWithAuthorAndGenre(req.params.id);
            return res.render("books/detail", { book, title: "Chi tiết sách" });
        } catch (error) {
            return res.redirect('not-found?error=' + encodeBase64(error.message))
        }
    }

    static async handleCreateBook(req, res) {
        const image = req.file?.path || null;
        const body = req.body || {};
        try {

            const data = await BookService.createBook({ ...body, image_cover: image });
            return res.redirect("/books?success=" + encodeBase64("Thêm sách thành công"));
        } catch (error) {
            console.log(error);

            return res.render("bookss/add", { title: "Thêm sách", error: error.message, book: req.body });
        }
    }
    static async handleEditBook(req, res) {
        const image = req.file?.path || null;
        const body = req.body || {};
        const id = req.params.id
        try {
            const data = await BookService.updateBook(id, { ...body, image_cover: image });
            return res.redirect("/books?success=" + encodeBase64("Cập nhật sách thành công"));
        } catch (error) {
            return res.redirect("/books/edit/" + id + "?error=" + encodeBase64(error.message));
        }
    }
    static async handleDeleteBook(req, res) {
        try {
            const data = await BookService.deleteBook(req.params.id);
            return res.redirect("/books?success=" + encodeBase64("Xóa sách thành công"));
        } catch (error) {
            return res.redirect("/books?error=" + encodeBase64(error.message));
        }
    }
    static async handleSearchBooks(req, res) {
        try {
            const { q } = req.query;
            const { rows: books, count: total } = await BookService.searchBooks(q || "");
            return res.json({ success: true, data: books, total });
        } catch (error) {
            return res.json({ success: false, message: error.message, data: [], total: 0 });
        }
    }
}

module.exports = BookController;