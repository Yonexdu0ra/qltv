const bcrypt = require("bcrypt");
const { accountRepository } = require("../repositories");
const { Op } = require("sequelize");
class AccountServices {
    static getAllAccounts(query = {}, options = {}) {
        return accountRepository.findAll(query, options);
    }
    static getAllAccountWithPagination(query = {}, options = {}) {
        const where = {}
        if (query.q) {
            where.username = {
                [Op.like]: `%${query.q || ""}%`
            }
        }
        const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
        const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
        const offset = (page - 1) * limit
        const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["created_at", "ASC"]
        const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
        return accountRepository.findWithPagination(query, { limit, offset, order, ...options });
    }
    static getAllAccountWithUserPagination(query = {}, options = {}) {
        const where = {}
        const userWhere = {}
        if (query.q) {
            where.username = {
                [Op.like]: `%${query.q || ""}%`
            }
            userWhere.fullName = {
                [Op.like]: `%${query.q || ""}%`
            }
        }
        const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
        const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
        const offset = (page - 1) * limit
        const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["created_at", "ASC"]
        const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
        return accountRepository.findWithUserPagination(where, { userWhere, limit, offset, order, ...options });
    }
    static getAccountById(id, options = {}) {
        return accountRepository.findByPk(id, options);
    }
    static getAccountByIdWithUser(id, options = {}) {
        return accountRepository.findOneWithUser({ id }, options);
    }
    static createAccount(data, options) {
        return accountRepository.create(data, options);
    }
    static async updateAccountById(data, id, options = {}) {
        const [updatedRow] = await accountRepository.update(data, { id }, options);
        return updatedRow > 0;
    }
    static async reissuePasswordAccountById(id, newPassword) {
        try {
            const passwordHash = await bcrypt.hash(newPassword, 10);
            const [isUpdated] = await accountRepository.update({ password: passwordHash }, { id });
            return isUpdated > 0
        } catch (error) {
            throw error;
        }
    }

}


module.exports = AccountServices;