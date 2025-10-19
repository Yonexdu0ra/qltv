
const authorService = require("../services/authorServices");

const encodeBase64 = require("../utils/base64");

class AuthorController {

    static async renderViewAuthor(req, res) {
        try {
            const { rows: authors, count: totals } = await authorService.getAuthorsPagination(req.query);
            const totalPages = Math.ceil(totals / (req.query.limit || 10));
            const page = parseInt(req.query.page) || 1;
            return res.render("authors/index", { authors, totals: totalPages, title: "Quản lý tác giả", page, query: req.query });
        } catch (error) {
            return res.render("authors/index", { authors: [], totals: 0, page: 1, title: "Quản lý tác giả", error: error.message, query: req.query });
        }
    }
    static renderViewCreateAuthor(req, res) {
        try {
            return res.render("authors/add", { title: "Thêm tác giả", author: {} });
        } catch (error) {
            return res.render("authors/add", { title: "Thêm tác giả", error: error.message, author: {} });
        }
    }
    static async renderViewUpdateAuthor(req, res) {
        try {
            const authorId = req.params.id;
            const author = await authorService.getAuthorById(authorId);
            if (!author) throw new Error("Tác giả không tồn tại");
            return res.render("authors/edit", { title: "Cập nhật tác giả", author });
        } catch (error) {
            return res.redirect("/not-found?error=" + encodeBase64(error.message));
        }
    }
    static async renderViewDeleteAuthor(req, res) {
        try {
            const authorId = req.params.id;
            const author = await authorService.getAuthorById(authorId);
            if (!author) throw new Error("Tác giả không tồn tại");
            return res.render("authors/delete", { title: "Xóa tác giả", author });
        } catch (error) {
            return res.redirect("/not-found?error=" + encodeBase64(error.message));
        }
    }
    static async renderViewDetailAuthor(req, res) {
        const { id } = req.params;
        try {

            const { count, rows: author } = await authorService.getAuthorsPaginationByIdWithBooks(id, req.query);
            if (!author) throw new Error("Tác giả không tồn tại");
            const totalPages = Math.ceil(count / (req.query.limit || 10));

            return res.render("authors/detail", { title: "Chi tiết tác giả", author, totals: totalPages, page: parseInt(req.query.page) || 1, query: req.query });
        } catch (error) {
            console.log(error);
            
            return res.redirect("/not-found?error=" + encodeBase64(error.message));
        }
    }

    static async handleCreateAuthor(req, res) {
        try {
            const { name } = req.body;
            if (!name || name.trim() === "") throw new Error("Tên tác giả không được để trống");
            const newAuthor = await authorService.createAuthor({ name: name.trim() });
            return res.redirect("/authors?success=" + encodeBase64("Thêm tác giả thành công"));
        } catch (error) {
            return res.render("authors/add", { title: "Thêm tác giả", error: error.message, author: req.body });
        }
    }
    static async handleUpdateAuthor(req, res) {
        const authorId = req.params.id;
        try {
            const { name } = req.body;
            if (!name || name.trim() === "") {
                return res.status(400).json({ message: "Tên tác giả không được để trống" });
            }
            const updatedAuthor = await authorService.updateAuthor(authorId, { name: name.trim() });
            if (!updatedAuthor) throw new Error("Cập nhật tác giả thất bại");
            return res.redirect("/author?success=" + encodeBase64("Cập nhật tác giả thành công"));
        } catch (error) {
            return res.render("authors/edit", { title: "Cập nhật tác giả", error: error.message, author: { id: authorId, ...req.body } });
        }
    }
    static async handleDeleteAuthor(req, res) {
        try {
            const authorId = req.params.id;
            const deleted = await authorService.deleteAuthor(authorId);
            if (!deleted) throw new Error("Xóa tác giả thất bại");
            return res.redirect("/author?success=" + encodeBase64("Xóa tác giả thành công"));
        } catch (error) {
            return res.render("authors/index", { title: "Quản lý tác giả", error: error.message });
        }
    }
    static async handleSearchAuthor(req, res) {
        try {
            const { q } = req.query;
            const { rows: authors, count: total } = await authorService.searchAuthors(q || "");
            return res.json({ success: true, data: authors, total });
        } catch (error) {
            return res.json({ success: false, message: error.message, data: [], total: 0 });
        }
    }

    static async renderViewAuthorByAuthorIdForReader(req, res) {
        const { id } = req.params;
        try {
            const limit = parseInt(req.query.limit) || 10;
            const { rows: authors, count: total } = await authorService.getAuthorsPaginationByIdWithBooks(id, req.query);
            const totalPages = Math.ceil(total / limit);
        } catch (error) {
            return
        }
    }
}


module.exports = AuthorController;