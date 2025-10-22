const { userRepository } = require("../repositories");



class UserServices {

    static async getUserById(id, options = {}) {
        return userRepository.findByPk(id, options);
    }
    static async getUsersWithPagination(options) {
        const where = {}
        if (options.q) {
            where.fullname = {
                [Op.like]: `%${options.q}%`
            }
        }
        const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
        const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
        const offset = (page - 1) * limit
        const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["fullname", "ASC"]
        const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
        return userRepository.findAllAndCount(where, { limit, offset, order, ...options });

    }
    static async getUsersWithAccountPagination(options) {
        const where = {}
        const accountWhere = {}
        if (options.q) {
            where.fullname = {
                [Op.like]: `%${options.q}%`
            }
            accountWhere.username = {
                [Op.like]: `%${options.q}%`
            }
        }
        const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
        const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
        const offset = (page - 1) * limit
        const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["fullname", "ASC"]
        const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
        return userRepository.findAllWithAccountPagination(where, { accountWhere,limit, offset, order, ...options });

    }
    static async createUser(data, options = {}) {
        return await userRepository.create(data, {
            fields: ['fullname', 'email', 'phone', 'address'],
            ...options
        });

    }
    static async updateUserById(id, data) {
        const [isUpdated] = await userRepository.update(data, { id }, {
            fields: ['fullname', 'email', 'phone', 'address']
        });
        return isUpdated > 0
    }
    static async deleteUserById(id, options = {}) {
        const deletedRowsCount = await userRepository.delete({ id }, options);
        return deletedRowsCount > 0;
    }
    static async countUsers(query, options = {}) {
        return await userRepository.count(query, options);
    }
    static async countUsers(where = {}) {
        return userRepository.count(where);
    }
}

module.exports = UserServices;