const { Op } = require("sequelize");
const GenreRepository = require("../repositories/genreRepository");



class GenreServices {


    static async getAllGenresWithPagination(query, options = {}) {
        const genres = await GenreRepository.findGenres(query, options);
        return genres;
    }
    static async getGenreById(id, options = {}) {
        return await GenreRepository.findByPk(id, options);
    }
    static async createGenre(data, options = {}) {
        return await GenreRepository.createGenre(data, {
            fields: ["name", 'slug', 'description'],
            ...options
        });

    }
    static async getAllGenreByIds(genreIds = [], options = {}) {
        return GenreRepository.findAll(
            { id: { [Op.in]: genreIds } },
            { ...options }
        );
    }
    static async updateGenreById(id, data) {
        const [updatedRowsCount] = await GenreRepository.update(data, id, {
            fields: ["name", 'slug', 'description'],
            where: { id }
        });

        return updatedRowsCount > 0;
    }

    static async deleteGenre(id, options = {}) {
        const deletedRowsCount = await GenreRepository.delete({ id });
        return deletedRowsCount > 0;
    }
    static async getGenresByName(query, options = {}) {
        const where = {};
        if (query) {
            where.name = {
                [Op.like]: `%${query.q}%`
            };
        }
        const limit = query.limit ? query.limit > 0 ? parseInt(query.limit) : 10 : 10;
        const page = isNaN(parseInt(query.page)) || parseInt(query.page) < 1 ? 1 : parseInt(query.page);
        const offset = (page - 1) * limit;
        const order = [["created_at", "ASC"]];
        return await GenreRepository.findAllWithBooksPagination(where, { ...options, limit, offset, order });
    }
    static async getAllGenresWithPagination(query, options = {}) {
        const where = {}
        if (query) {
            where.name = {
                [Op.like]: `%${query.q}%`
            }
        }
        const limit = query.limit ? query.limit > 0 ? parseInt(query.limit) : 5 : 5
        const page = isNaN(parseInt(query.page)) || parseInt(query.page) < 1 ? 1 : parseInt(query.page)
        const offset = (page - 1) * limit
        const [sortBy, sortOrder] = query.sort ? query.sort.split("-") : ["name", "ASC"]
        const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
        return await GenreRepository.findAllAndCount(where, { ...options, limit, offset, order });
    }
    static countGenres() {
        return GenreRepository.count();
    }
}

module.exports = GenreServices;