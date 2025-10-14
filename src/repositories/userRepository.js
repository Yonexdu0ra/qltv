
const { User } = require("../models");

class UserRepository {
    static async findUser(query, options = {}) {
        try {
            return await User.findOne({ where: query, ...options });
        }
        catch (error) {
            throw error;
        }
    }
    static async findUsers(query, options = {}) {
        try {
            return await User.findAll({ where: query, ...options });
        }
        catch (error) {
            throw error;
        }
    }
    static async findUsersPagination({ where, limit, offset, order }, options = {}) {
        return await User.findAndCountAll({ where, limit, offset, order, ...options });
    }
    static async updateUser(query, data, options = {}) {
        try {
            return await User.update(data, { where: query, ...options });
        }
        catch (error) {
            throw error;
        }
    }
    static async createUser(data, options = {}) {
        try {
            return await User.create(data, options);
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = UserRepository;