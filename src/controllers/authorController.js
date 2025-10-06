
const AuthorService = require("../services/authorServices");


class AuthorController {
    
    static async renderViewAuthor(req, res) {
       try {
         return res.json(await AuthorService.getAllAuthors())
       } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
       }
    }
    static renderViewCreateAuthor(req, res) {}
    static renderViewUpdateAuthor(req, res) {}
    static renderViewDeleteAuthor(req, res) {}
    static async renderViewDetailAuthor(req, res) {
        return res.json(await AuthorService.getAuthorDetails(req.params.id));
    }

    static async handleCreateAuthor(req, res) {
        try {
            const { name } = req.body;
            if (!name || name.trim() === "") {
                return res.status(400).json({ message: "Tên tác giả không được để trống" });
            }
            const newAuthor = await AuthorService.createAuthor({ name: name.trim() });
            return res.status(201).json(newAuthor);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async handleUpdateAuthor(req, res) {
        try {
            const authorId = req.params.id;
            const { name } = req.body;
            if (!name || name.trim() === "") {
                return res.status(400).json({ message: "Tên tác giả không được để trống" });
            }
            const updatedAuthor = await AuthorService.updateAuthor(authorId, { name: name.trim() });
            if (!updatedAuthor) {
                return res.status(404).json({ message: "Tác giả không tồn tại" });
            }
            return res.status(200).json(updatedAuthor);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async handleDeleteAuthor(req, res) {
        try {
            const authorId = req.params.id;
            const deleted = await AuthorService.deleteAuthor(authorId);
            if (!deleted) {
                return res.status(404).json({ message: "Tác giả không tồn tại" });
            }
            return res.json({ message: "Xóa tác giả thành công" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}


module.exports = AuthorController;