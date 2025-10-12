
const AuthorService = require("../services/authorServices");

const encodeBase64 = require("../utils/base64");

class AuthorController {

    static async renderViewAuthor(req, res) {
        try {
            const authors = await AuthorService.getAllAuthors(req.query);
            return res.render("authors/index", { authors, title: "Quản lý tác giả" });
        } catch (error) {
            return res.render("authors/index", { authors: [], title: "Quản lý tác giả", error: error.message });
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
            const author = await AuthorService.getAuthorById(authorId);
            if (!author) throw new Error("Tác giả không tồn tại");
            return res.render("authors/edit", { title: "Cập nhật tác giả", author });
        } catch (error) {
            return res.redirect("/not-found?error=" + encodeBase64(error.message));
        }
    }
    static async renderViewDeleteAuthor(req, res) {
        try {
            const authorId = req.params.id;
            const author = await AuthorService.getAuthorById(authorId);
            if (!author) throw new Error("Tác giả không tồn tại");
            return res.render("authors/delete", { title: "Xóa tác giả", author });
        } catch (error) {
            return res.redirect("/not-found?error=" + encodeBase64(error.message));
        }
    }
    static async renderViewDetailAuthor(req, res) {
        try {
            const author = await AuthorService.getAuthorDetails(req.params.id);
            if (!author) throw new Error("Tác giả không tồn tại");
            return res.render("authors/detail", { title: "Chi tiết tác giả", author });
        } catch (error) {
            return res.redirect("/not-found?error=" + encodeBase64(error.message));
        }
    }

    static async handleCreateAuthor(req, res) {
        try {
            const { name } = req.body;
            if (!name || name.trim() === "") throw new Error("Tên tác giả không được để trống");
            const newAuthor = await AuthorService.createAuthor({ name: name.trim() });
            return res.redirect("/author?success=" + encodeBase64("Thêm tác giả thành công"));
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
            const updatedAuthor = await AuthorService.updateAuthor(authorId, { name: name.trim() });
            if (!updatedAuthor) throw new Error("Cập nhật tác giả thất bại");
            return res.redirect("/author?success=" + encodeBase64("Cập nhật tác giả thành công"));
        } catch (error) {
            return res.render("authors/edit", { title: "Cập nhật tác giả", error: error.message, author: { id: authorId, ...req.body } });
        }
    }
    static async handleDeleteAuthor(req, res) {
        try {
            const authorId = req.params.id;
            const deleted = await AuthorService.deleteAuthor(authorId);
            if (!deleted) throw new Error("Xóa tác giả thất bại");
            return res.redirect("/author?success=" + encodeBase64("Xóa tác giả thành công"));
        } catch (error) {
            return res.render("authors/index", { title: "Quản lý tác giả", error: error.message });
        }
    }
}


module.exports = AuthorController;