const { Op } = require("sequelize");
const { Author, Book } = require("../models");


class AuthorRepository {
    static async findAuthorsByName(name) {
        return Author.findAndCountAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        });
    }
    static async findAuthors(query, options = {}) {
        return Author.findAll({
            where: query,
            ...options
        });
    }
    static async findAuthor(query, options = {}) {
        return Author.findOne({
            where: query,
            ...options
        });
    }
    static async findAuthorById(id, options = {}) {
        return Author.findOne({
            where: { id },
            ...options
        });
    }
    static async findAuthorByIdWithBooks(id, options = {}) {
        return Author.findOne({
            where: { id },
            include: {
                model: Book,
                as: "books"
            },
            ...options
        });
    }
    static async findAuthorsPagination({ where, offset = 0, limit = 5, order = [["createdAt", "DESC"]] }, options) {
        return Author.findAndCountAll({
            where,
            offset,
            limit,
            order,
            
            ...options
        });
    }
    static async findAuthorsWithBooks(query, options = {}) {
        return Author.findAll({
            where: query,
            include: {
                model: Book,
                as: "books"
            },
            ...options
        });
    }
    static async findAuthorsWithBooksPagination({ where, offset = 0, limit = 5, order = [["createdAt", "DESC"]] }, options) {
        return Author.findAndCountAll({
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
    static async createAuthor(data, options = {}) {
        return Author.create(data, options);
    }
    static async updateAuthor(query, data, options = {}) {
        const [updatedRow] = await Author.update(data, { where: query, ...options });
        return updatedRow > 0;
    }
    static async deleteAuthor(query, options = {}) {
        return Author.destroy({ where: query, ...options });

    }
}


module.exports = AuthorRepository;