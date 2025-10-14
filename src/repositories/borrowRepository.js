const { Borrow, BorrowDetail, Book } = require("../models");


class BorrowRepository {

    static async createBorrow(data, options = {}) {
        return Borrow.create(data, {
            ...options
        });
    }
    static async findBorrows(query = {}, options = {}) {
        return Borrow.findAll({
            where: {
                ...query
            },
            ...options
        });
    }
    static async findBorrow(query = {}, options = {}) {
        return Borrow.findOne({
            where: {
                ...query
            },
            ...options
        });
    }

    static async findBorrowPagination({ where = {}, limit = 10, offset = 0, order = [['createdAt', 'DESC']] }, options = {}) {
        return Borrow.findAndCountAll({
            where: {
                ...where
            },
            limit,
            offset,
            order,
            ...options
        });
    }
    static async findBorrowPaginationWithBooks({ where = {}, limit = 10, offset = 0, order = [['createdAt', 'DESC']] }, options = {}) {
        return Borrow.findAndCountAll({
            include: [{
                model: Book,
                as: "books",
                through: options.through || [],
                where
            }],
            limit,
            offset,
            order,
            distinct: true,
            ...options
        });
    }

    static findBorrowWithBooks(query, options = {}) {
        return Borrow.findOne({
            where: {
                ...query
            },
            include: [
                {
                    model: Book,
                    as: "books",
                    through: options.through || []
                }
            ],
            ...options
        });
    }
    static async findBorrowsWithBooks(query = {}, options = {}) {
        return Borrow.findAll({
            where: {
                ...query
            },
            include: [
                {
                    model: Book,
                    as: "books",
                    through: options.through || []
                }
            ],
            distinct: true,
            ...options
        });
    }

    static async findBorrowById(id, options = {}) {
        return Borrow.findByPk(id, {
            ...options
        });
    }
    static async updateBorrow(query, data, options = {}) {
        return Borrow.update(data, {
            where: { ...query },
            ...options
        });
    }
    static async deleteBorrow(query, options = {}) {
        return Borrow.destroy({
            where: { ...query },
            ...options
        });
    }
}



module.exports = BorrowRepository;
