const { Account, User } = require("../models");
class AccountRepository {
    static async findAccounts(query, options = {}) {
        return await Account.findAll({
            where: query,
            ...options
        });
    }

    static async findAccount(query, options = {}) {
        return await Account.findOne({
            where: query,
            ...options
        });
    }

    static findAccountsWithUser(query, options = {}) {
        return Account.findAll({
            where: query,
            include: {
                model: User,
                as: "user",
                ...options?.user
            },
            ...options
        });
    }
    static findAccountWithUser(query, options = {}) {
        return Account.findOne({
            where: query,
            include: {
                model: User,
                as: "user"
            },
            ...options
        });
    }

    static findAccountsPagination({ where, offset = 0, limit = 5, order = [["createdAt", "DESC"]] }, options = {}) {
        return Account.findAndCountAll({
            where,
            offset,
            limit,
            order,
            ...options
        });
    }
    static findAccountsPaginationWithUser({ where, offset = 0, limit = 5, order = [["createdAt", "DESC"]] }, options = {}) {
        return Account.findAndCountAll({
            where,
            offset,
            limit,
            order,
            include: {
                model: User,
                as: "user",
                ...options?.user
            },
            ...options
        });
    }

    static async createAccount(data, options = {}) {
        return await Account.create(data, options);
    }
    static async updateAccount(query, data, options = {}) {

        return await Account.update({
            ...data
        }, { where: query, ...options });
    }
    static async deleteAccount(query, options = {}) {
        return await Account.destroy({ where: query, ...options });
    }

}

module.exports = AccountRepository;