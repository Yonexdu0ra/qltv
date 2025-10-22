const { Op } = require("sequelize");
const GenreRepository = require("../repositories/genreRepository");



class GenreServices {

    static async getAllGenreByNameWithPagination(query, options = {}) {
        const where = {};
        if (query.q) {
            where.name = {
                [Op.like]: `%${query.q}%`
            }
        }
        const limit = query.limit ? query.limit > 0 ? parseInt(query.limit) : 10 : 10;
        const page = isNaN(parseInt(query.page)) || parseInt(query.page) < 1 ? 1 : parseInt(query.page);
        const offset = (page - 1) * limit;
        const order = [["created_at", "ASC"]];

        return await GenreRepository.findAllAndCount(where, { ...options, limit, offset, order });
    }
    static async getGenreById(id, options = {}) {
        return await GenreRepository.findByPk(id, options);
    }
    static async getGenreByIdWithBooks(id, options = {}) {
        return await GenreRepository.findOneWithBooks({ id }, options);
    }
    static async createGenre(data, options = {}) {
        return await GenreRepository.createGenre(data, {
            ...options
        });

    }
    static async getGenreBySlug(slug, options = {}) {
        return GenreRepository.findOne({ slug }, { ...options });
    }
    static async getGenreBySlugWithBooks(slug, options = {}) {
        return GenreRepository.findOneWithBooks({ slug }, { ...options });
    }
    static async getGenreBySlugWithBooksPagination(slug, query, options = {}) {
        const bookWhere = {};
        if (options.q) {
            bookWhere.title = {
                [Op.like]: `%${options.q || ""}%`,
            };
        }
        const limit = options.limit
            ? options.limit > 0
                ? parseInt(options.limit)
                : 10
            : 10;
        const page =
            isNaN(parseInt(options.page)) || parseInt(options.page) < 1
                ? 1
                : parseInt(options.page);
        const offset = (page - 1) * limit;
        const order = [["created_at", "DESC"]];
        return GenreRepository.findOneWithBooksPagination(
            { slug },
            { limit, offset, ...options, bookWhere, order }
        );
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

    static async deleteGenreById(id, options = {}) {
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
        if (query.q) {
            where.name = {
                [Op.like]: `%${query.q}%`
            }
        }
        const limit = query.limit ? query.limit > 0 ? parseInt(query.limit) : 5 : 5
        const page = isNaN(parseInt(query.page)) || parseInt(query.page) < 1 ? 1 : parseInt(query.page)
        const offset = (page - 1) * limit
        const [sortBy, sortOrder] = query.sort ? query.sort.split("-") : ["created_at", "ASC"]
        const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]

        return GenreRepository.findAllAndCount(where, { ...options, limit, offset, order });
    }
    static countGenres(where = {}) {
        return GenreRepository.count(where);
    }
}

module.exports = GenreServices;