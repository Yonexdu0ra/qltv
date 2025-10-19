const { Borrow, BorrowDetail, Book, User } = require("../models");


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
                through: options.through ||{ attributes: [ "id"] },
                // where
            }],
            limit,
            offset,
            order,
            distinct: true,
            ...options
        });
    }
    static async findBorrowPaginationWithBorrowerAndBooks({ where = {}, limit = 10, offset = 0, order = [['createdAt', 'DESC']] }, options = {}) {
        return Borrow.findAndCountAll({
            include: [{
                model: Book,
                as: "books",
                through: options.through || { attributes: [ "id"] },
            },
            {
                as: "borrower",
                model: User,
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
    static findBorrowWithBooksAndBorrower(query, options = {}) {
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
                ,
                {
                    as: "borrower",
                    model: User,
                    
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
    static async findBorrowByIdWithBorrowDetail(id, options = {}) {
        return Borrow.findByPk(id, {
          include: [
            {
              model: BorrowDetail,
              as: "borrowDetails",
              ...options,
            },
          ],
          ...options,
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
