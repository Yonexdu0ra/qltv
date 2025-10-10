
const { Book, Author, Genre, BorrowDetail } = require('../models');

class BookRepository {

    static async findBooks(query, options = {}) {
        return Book.findAll(query, ...options);
    }
    static async findBookById(id, options = {}) {
        return Book.findByPk(id, { ...options });
    }
    static findBookByIdWithAuthorAndGenre(id, options = {}) {
        return Book.findOne({
            where: { id },
            include: [
                { model: Author, as: 'authors' },
                { model: Genre, as: 'genres' }
            ],
            ...options
        });
    }
    static findBookWithBorrowDetail(query, options = {}) {
        return Book.findOne({
            where: query,
            include: {
                model: BorrowDetail,
                as: 'borrowDetails'
            },
            ...options
        });
    }
    static findBooksWithBorrowDetail(query, options = {}) {
        return Book.findAll({
            where: query,
            include: {
                model: BorrowDetail,
                as: 'borrowDetails'
            },
            ...options
        });
    }
    static findBooksWithAuthorAndGenre(query, options = {}) {
        return Book.findAll({
            where: query,
            include: [
                { model: Author, as: 'authors' },
                { model: Genre, as: 'genres' }
            ],
            ...options
        });
    }
    static findBooksPagination({ where, offset = 0, limit = 5, order = [["createdAt", "DESC"]] }, options = {}) {
        return Book.findAndCountAll({
            where,
            offset,
            limit,
            order,
            ...options
        });
    }
    static findBooksWithAuthorsAndGenresPagination({ where, offset = 0, limit = 5, order = [["createdAt", "DESC"]] }, options = {}) {
        return Book.findAndCountAll({
            where,
            offset,
            limit,
            order,
            include: [
                { model: Author, as: 'authors', through: { attributes: [] }, attributes: ["id", "name"] },
                { model: Genre, as: 'genres', through: { attributes: [] }, attributes: ["id", "name"] }
            ],
            // attributes: { exclude: ['createdAt', 'updatedAt'] },
            distinct: true,
            ...options
        });
    }
    static async createBook(data, options = {}) {

        return Book.create({
            ...data
        }, { ...options });
    }
    static async updateBook(query, data, options = {}) {
        const [rowUpdated] = await Book.update({ ...data }, { where: query, ...options });
        return rowUpdated > 0;
    }
    static async deleteBook(query, options = {}) {

        const row = await Book.destroy({ where: query, ...options });
        return row > 0;
    }


}

module.exports = BookRepository;