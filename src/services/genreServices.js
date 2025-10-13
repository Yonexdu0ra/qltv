const { Op } = require("sequelize");
const GenreRepository = require("../repositories/genreRepository");



class GenreServices {


    static async getAllGenres() {
        try {
            const genres = await GenreRepository.findGenres({});
            return genres;
        } catch (error) {

            throw error;
        }
    }
    static async getGenreById(id) {
        try {
            const genre = await GenreRepository.findGenreById(id);
            return genre;
        } catch (error) {
            throw error;
        }
    }
    static async createGenre(data) {
        try {
            const genre = await GenreRepository.createGenre(data, {
                fields: ["name"]
            });
            return genre;
        } catch (error) {
            throw error;
        }
    }

    static async updateGenre(id, data) {
        try {
            const genre = await GenreRepository.findGenreById(id);
            if (!genre) {
                throw new Error("Thể loại không tồn tại");
            }

            const [updatedRowsCount] = await GenreRepository.updateGenre(id, data, {
                fields: ["name"],
                where: { id }
            });

            return updatedRowsCount > 0;
        } catch (error) {
            throw error;
        }
    }

    static async deleteGenre(id) {
        try {
            const genre = await GenreRepository.findGenreByIdWithBooks(id);
            if (!genre) {
                throw new Error("Thể loại không tồn tại không thể xóa");
            }
            if (genre.books && genre.books.length > 0) throw new Error("Không thể xóa thể loại vì có sách liên quan");
            const deletedRowsCount = await GenreRepository.deleteGenre({ id });
            return deletedRowsCount > 0;
        } catch (error) {
            throw error;
        }
    }
    static async searchGenres(query) {
        try {
            const where = {};
            if (query) {
                where.name = {
                    [Op.like]: `%${query}%`
                };
            }
            const limit = 10;
            const offset = 0;
            const order = [["name", "ASC"]];
            const options = { attributes: ["id", "name"] };
            return await GenreRepository.findGenresPagination({ where, limit, offset, order }, options);
        } catch (error) {
            throw error;
        }
    }

}

module.exports = GenreServices;