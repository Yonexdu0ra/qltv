const { Genre, Book } = require("../models");



class GenreRepository {
    static async findGenreByName(name) {
        return Genre.findOne({ where: { name } });
    }
    static async findGenres(query, options = {}) {
        return Genre.findAll({
            where: query,
            ...options
        });
    }
    static async findGenre(query, options = {}) {
        return Genre.findOne({
            where: query,
            ...options
        });
    }
    static async findGenreById(id, options = {}) {
        return Genre.findOne({
            where: { id },
            ...options
        });
    }
    static async findGenreByIdWithBooks(id, options = {}) {
        return Genre.findOne({
            where: { id },
            include: {
                model: Book,
                as: "books"
            },
            ...options
        });
    }
    static async findGenresPagination({ where, offset = 0, limit = 5, order = [["createdAt", "DESC"]] }, options) {
        return Genre.findAndCountAll({
            where,
            offset,
            limit,
            order,
            ...options
        });
    }
    static async findGenresWithBooks(query, options = {}) {
        return Genre.findAll({
            where: query,
            include: {
                model: Book,
                as: "books"
            },
            ...options
        });
    }
    static async findGenresWithBooksPagination({ where, offset = 0, limit = 5, order = [["createdAt", "DESC"]] }, options) {
        return Genre.findAndCountAll({
            where,
            include: {
                model: Book,
                as: "books"
            },
            offset,
            limit,
            order,
            ...options
        });
    }
    static async createGenre(data, options = {}) {
        return Genre.create(data, options);
    }
    static async updateGenre(query, data, options = {}) {
        return Genre.update(data, { where: query, ...options });
    }
    static async deleteGenre(query, options = {}) {
        return Genre.destroy({ where: query, ...options });
    }
}

module.exports = GenreRepository;