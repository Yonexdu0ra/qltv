
const { User, Account } = require("../models");

class UserRepository {
    static findAll(query, options = {}) {
        return User.findAll({
            where: query,
            ...options
        })
    }
    static findOne(query, options = {}) {
        return User.findOne({
            where: query,
            ...options
        })
    }
    static fineOneWithAccount(query, options = {}) {
        return User.findOne({
            where: query,
            ...options,
            include: [
                {
                    model: Account,
                    as: 'account',
                    attributes: options.accountAttributes || [],
                    where: options.accountWhere || {}
                }
            ]
        })
    }
    static findAllAndCount(query, options = {}) {
        return User.findAndCountAll({
            where: query,
            ...options
        })
    }
    static findAllWithAccountPagination(query, options = {}) {
        return User.findAndCountAll({
            where: query,
            ...options,
            include: [
                {
                    model: Account,
                    as: 'account',
                    attributes: options.accountAttributes || [],
                    where: options.accountWhere || {}
                }
            ]
        })
    }
    static findByPk(id, options = {}) {
        return User.findByPk(id, options);
    }
    static create(data, options = {}) {
        return User.create(data, options);
    }
    static count(query, options = {}) {
        return User.count({
            where: query,
            ...options
        });
    }

}

module.exports = UserRepository;