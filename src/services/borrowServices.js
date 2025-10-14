const { sequelize } = require("../models");
const borrowRepository = require("../repositories/borrowRepository");
const { BORROW_STATUS_CONSTANTS } = require("../utils/constants");



class BorrowServices {


    static async createBorrow(data) {
        const transaction = await sequelize.transaction();
        try {
            if(!data.books || !Array.isArray(data.books) || data.books.length === 0) {
                throw new Error("Vui lòng chọn sách muốn mượn");
            }
            const borrow = await borrowRepository.createBorrow(data, {
                fields: ["borrower_id", "borrow_date", "due_date"],
                transaction,
            });
            borrow.setBooks([...data.books], { transaction });
            await transaction.commit();
            return borrow;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async findBorrowsWithBooks(query = {}, options = {}) {
        return borrowRepository.findBorrowsWithBooks(query, options);
    }
    static async findBorrowWithBooks(query, options = {}) {
        return borrowRepository.findBorrowWithBooks(query, options);
    }
    static async getBorrowById(id) {
        return borrowRepository.findBorrowById(id);
    }
    static async getBorrowByIdWithBooks(id) {
        return borrowRepository.findBorrowWithBooks({ id });
    }

    static async updateBorrow(query, data, options = {}) {
        return borrowRepository.updateBorrow(query, data, options);
    }
    static async findBorrowPagination(options) {
        try {
            const where = {}
            if (options.q) {
                where.title = {
                    [Op.like]: `%${options.q}%`
                }
            }
            const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
            const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
            const offset = (page - 1) * limit


            const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["createdAt", "ASC"]

            const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
            return await borrowRepository.findBorrowPagination({ where, limit, offset, order })
        } catch (error) {
            throw error;
        }
    }
    static async findBorrowPaginationWithUserId(borrower_id, options) {
        try {
            const where = { borrower_id }
            if (options.q) {
                where.title = {
                    [Op.like]: `%${options.q}%`
                }
            }
            const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
            const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
            const offset = (page - 1) * limit


            const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["createdAt", "ASC"]

            const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
            return await borrowRepository.findBorrowPagination({ where, limit, offset, order })
        } catch (error) {
            throw error;
        }
    }

    static async markAsApproved(id, approver_id) {
        try {
            const [rowUpdated] = await borrowRepository.updateBorrow({ id }, { status: BORROW_STATUS_CONSTANTS.APPROVED, approver_id });
            return rowUpdated > 0;
        } catch (error) {
            throw error;
        }
    }
    static async markAsRejected(id) {
        try {
            const [rowUpdated] = await borrowRepository.updateBorrow({ id }, { status: BORROW_STATUS_CONSTANTS.REJECTED });
            return rowUpdated > 0;
        }
        catch (error) {
            throw error;
        }
    }
    static async markAsExpired(id) {
        try {
            const [rowUpdated] = await borrowRepository.updateBorrow({ id }, { status: BORROW_STATUS_CONSTANTS.EXPIRED });
            return rowUpdated > 0;
        }
        catch (error) {
            throw error;
        }
    }
    static async markAsReturned(id) {
        try {
            const [rowUpdated] = await borrowRepository.updateBorrow({ id }, { status: BORROW_STATUS_CONSTANTS.RETURNED, return_date: new Date() });
            return rowUpdated > 0;
        }
        catch (error) {
            throw error;
        }
    }

}

module.exports = BorrowServices;