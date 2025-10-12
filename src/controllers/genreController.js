const GenreServices = require("../services/genreServices");
const encodeBase64 = require("../utils/base64");
class GenreController {


    static async renderViewGenre(req, res) {
        try {
            const genres = await GenreServices.getAllGenres();
            return res.render("genres/index", { title: "Quản lý thể loại", genres });
        } catch (error) {
            return res.redirect('/genres?error=' + encodeBase64(error.message));
        }
    }

    static async renderViewCreateGenre(req, res) { 
        try {
            return res.render("genres/add", { title: "Thêm thể loại" });
        } catch (error) {
            return res.redirect('/genres?error=' + encodeBase64(error.message));
        }
    }
    static async renderViewUpdateGenre(req, res) { 
        try {
            const { id } = req.params;
            const genre = await GenreServices.getGenreById(id);
            if (!genre) throw new Error("Thể loại không tồn tại");
            return res.render("genres/edit", { title: "Sửa thể loại", genre });
        } catch (error) {
            return res.redirect('/genres?error=' + encodeBase64(error.message));
        }
    }
    static async renderViewDeleteGenre(req, res) { 
        try {
            const { id } = req.params;
            const genre = await GenreServices.getGenreById(id);
            if (!genre) throw new Error("Thể loại không tồn tại");
            return res.render("genres/delete", { title: "Xoá thể loại", genre });
        } catch (error) {
            return res.redirect('/genres?error=' + encodeBase64(error.message));
        }
    }
    static async renderViewDetailGenre(req, res) { 
        try {
            const { id } = req.params;
            const genre = await GenreServices.getGenreById(id);
            if (!genre) throw new Error("Thể loại không tồn tại");
            return res.render("genres/detail", { title: "Chi tiết thể loại", genre });
        } catch (error) {
            return res.redirect('/genres?error=' + encodeBase64(error.message));
        }
    }
    static async handleCreateGenre(req, res) {
        try {
            const { name } = req.body;
            if (!name) throw new Error("Vui lòng nhập tên thể loại");
            const genre = await GenreServices.createGenre({ name });
            return res.json({ message: "Tạo thể loại thành công", genre });
        } catch (error) {
            return res.json({ message: error.message });
        }
    }

    static async handleUpdateGenre(req, res) {
        const { id } = req.params;
        const { name } = req.body;
        try {
            if (!name) throw new Error("Vui lòng nhập tên thể loại");
            const isUpdated = await GenreServices.updateGenre(id, { name });
            console.log(isUpdated);

            if (!isUpdated) throw new Error("Cập nhật thể loại thất bại");
            return res.json({ message: "Cập nhật thể loại thành công" });
        } catch (error) {

            return res.json({ message: error.message });
        }

    }
    static async handleDeleteGenre(req, res) {
        const { id } = req.params;
        try {
            const isDeleted = await GenreServices.deleteGenre(id);
            if (!isDeleted) throw new Error("Xoá thể loại thất bại");
            return res.json({ message: "Xoá thể loại thành công" });
        } catch (error) {
            return res.json({ message: error.message });
        }
    }


}

module.exports = GenreController;