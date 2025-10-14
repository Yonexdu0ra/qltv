const userRepository = require("../repositories/userRepository");



class UserServices {

    static async findUserById(id) {
        try {
            return await userRepository.findUser({ id }, { attributes: ['id', 'fullname', 'email', 'phone', 'address', 'createdAt'] });
        } catch (error) {
            throw error;
        }
    }
    static async findUsersPagination(options) {
        try {
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
            const data = await userRepository.findUsersPagination({ where, limit, offset, order }, { attributes: ['id', 'fullname', 'email', 'phone', 'address', 'createdAt'] });
            
            return data;
        } catch (error) {
            console.log(error.message);
            
            throw error;
        }
    }
    static async createUser(data, options = {}) {
        try {
            const user = await userRepository.createUser(data, {
                fields: ['fullname', 'email', 'phone', 'address'],
                ...options
            });
            return user;
        } catch (error) {
            throw error;
        }
    }
    static async updateUser(id, data) {
        try {
            console.log(data);
            
            const [isUpdated] = await userRepository.updateUser({ id }, data, {
                fields: ['fullname', 'email', 'phone', 'address']
            });
            return isUpdated > 0
        } catch (error) {
            console.log(error.message);
            
            throw error;
        }
    }
}

module.exports = UserServices;