const bcrypt = require("bcrypt");
const accountRepository = require("../repositories/accountRepository");
const { Op } = require("sequelize");

class AccountServices {

    static async findAccountsPagination(options) {
        try {
            try {
                const where = {}
                if (options.q) {
                    where.username = {
                        [Op.like]: `%${options.q}%`
                    }
                }
                const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
                const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
                const offset = (page - 1) * limit


                const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["username", "ASC"]

                const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
                return await accountRepository.findAccountsPagination({ where, limit, offset, order }, { attributes: ['id', 'username', 'role', 'createdAt'] });
            } catch (error) {
                throw error;
            }
        } catch (error) {

        }
    }
    static async findAccountsPaginationWithUser(options) {
        try {
            try {
                const where = {}
                if (options.q) {
                    where.username = {
                        [Op.like]: `%${options.q}%`
                    }
                }
                const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
                const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
                const offset = (page - 1) * limit


                const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["username", "ASC"]

                const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
                return await accountRepository.findAccountsPaginationWithUser({ where, limit, offset, order }, {
                    attributes: ['id', 'username', 'role', 'createdAt'], user: {
                        attributes: ['id', 'fullname']
                    }
                });
            } catch (error) {
                console.log(error.message);
                
                throw error;
            }
        } catch (error) {

        }
    }
    static async findAccountById(id) {
        try {
            return await accountRepository.findAccount({ id });
        } catch (error) {
            throw error;
        }
    }
    static async findAccountByIdWithUser(id) {
        try {
            return await accountRepository.findAccountWithUser({ id });
        } catch (error) {
            throw error;
        }
    }
    static async createAccount(data, options = {}) {

        try {
            const passwordHash = await bcrypt.hash(data.password, 10);
            const account = await accountRepository.createAccount({
                username: data.username,
                password: passwordHash,
                role: data.role,
                user_id: data.user_id
            }, {
                fields: ['username', 'password', 'role', 'user_id'],
                ...options
            });

            return account;
        } catch (error) {
            throw error;
        }
    }
    static async reissuePassword(id, newPassword) {
        try {
            const passwordHash = await bcrypt.hash(newPassword, 10);
            const [isUpdated] = await accountRepository.updateAccount({ id }, { password: passwordHash });
            return isUpdated > 0
        } catch (error) {
            throw error;
        }
    }

}


module.exports = AccountServices;