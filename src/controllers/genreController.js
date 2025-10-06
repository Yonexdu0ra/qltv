const GenreServices = require("../services/genreServices");

class GenreController {


    static async  renderViewGenre(req, res) {
        try {
            return res.json(await GenreServices.getAllGenres())
        } catch (error) {
            return res.json({ message: error.message });
        }
     }

    static async renderViewCreateGenre(req, res) { }
    static async renderViewUpdateGenre(req, res) { }
    static async renderViewDeleteGenre(req, res) { }

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