const { Op } = require("sequelize");
const { authorRepository } = require("../repositories");
const generateSlug = require("../utils/generateSlug");
class AuthorServices {
    static async getAuthorsByName(name, options = {}) {
        const where = {
            name: {
                [Op.like]: `%${name || ""}%`
            }
        }
        const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
        const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
        const offset = (page - 1) * limit
        const authors = await authorRepository.findAllAndCount({ where }, { limit, offset, ...options });
        return authors;
    }
    static async getAuthorBySlug(slug, options = {}) {
        return authorRepository.findOne({ slug }, { ...options });
    }
    static async getAuthorBySlugWithBooks(slug, options = {}) {
        return authorRepository.findOneWithBooks({ slug }, { ...options });
    }
    static async getAuthorByIdWithBooks(id, options = {}) {
        return authorRepository.findOneWithBooks({ id }, { ...options });
    }
    static async getAuthorById(id, options = {}) {
        return authorRepository.findByPk(id, { ...options });
    }
    static async getAuthorsWithBooksPagination(query = {}, options = {}) {
        const where = {}
        const bookWhere = {}
        if (query.q) {
            where.name = {
                [Op.like]: `%${query.q || ""}%`
            }
            bookWhere.title = {
                [Op.like]: `%${query.q || ""}%`
            }
        }
        const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
        const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
        const offset = (page - 1) * limit
        const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["created_at", "ASC"]
        const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
        if (!sortOrder || !sortBy) {
            order = [["created_at", "ASC"]];
        }
        return authorRepository.findWithBooksPagination(where, { bookWhere, limit, offset, order, ...options });
    }
    static async getAuthorsWithPagination(query = {}, options = {}) {
        const where = {}
        if (query.q) {
            where.name = {
                [Op.like]: `%${query.q || ""}%`
            }

        }
        const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
        const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
        const offset = (page - 1) * limit
        const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["created_at", "ASC"]
        const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
        if (!sortOrder || !sortBy) {
            order = [["created_at", "ASC"]];
        }
        return authorRepository.findWithPagination(where, { limit, offset, order, ...options });
    }

    static async createAuthor(data, options = {}) {
        return authorRepository.create(data, {
            fields: ['name', 'slug', 'bio'],
            attributes: ['id', 'name', 'slug', 'bio'],
            ...options
        });
    }
    static async updateAuthorById(data, id, options = {}) {
        const [updatedRows] = await authorRepository.update(data, { id }, {
            fields: ['name', 'slug', 'bio'],
            ...options
        });
        return updatedRows > 0;
    }
    static async deleteAuthorById(id, options = {}) {
        const deletedRows = await authorRepository.delete({ id }, options);
        return deletedRows > 0;
    }
}


module.exports = AuthorServices;