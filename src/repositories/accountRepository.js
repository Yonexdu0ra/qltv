const { Account, User } = require("../models");
class AccountRepository {
    static findAll(query = {}, options = {}) {
        return Account.findAll({
            where: { ...query },
            ...options
        });
    }
    static findOne(query = {}, options = {}) {
        return Account.findOne({
            where: { ...query },
            ...options
        });
    }
    static findOneWithUser(query = {}, options = {}) {
        return Account.findOne({
            where: { ...query },
            ...options,
            include: [{
                model: User,
                as: 'user',
                where: options.userWhere || {},
                attributes: options.userAttributes || [],
            }]
        });
    }
    static findByPk(id, options = {}) {
        return Account.findByPk(id, options);
    }
    static findAllAndCount(query = {}, options = {}) {
        return Account.findAndCountAll({
            where: { ...query },
            ...options
        });
    }
    static findWithPagination(query = {}, options = {}) {
        return Account.findAndCountAll({
            where: { ...query } || {},
            limit: options.limit || 10,
            offset: options.offset || 0,
            order: options.order || [],
            distinct: true,

            ...options
        });
    }
    static findWithUserPagination(query = {}, options = {}) {
        return Account.findAndCountAll({
            where: { ...query } || {},
            limit: options.limit || 10,
            offset: options.offset || 0,
            order: options.order || [],
            distinct: true,
            ...options,
            include: [{
                model: User,
                as: 'user',
                where: options.userWhere || {},
                attributes: options.userAttributes || [],
            }]
        });
    }
    static create(data, options = {}) {
        return Account.create(data, options);
    }
    static update(data, query = {}, options = {}) {
        return Account.update(data, {
            where: { ...query },
            ...options
        });
    }
    static delete(query = {}, options = {}) {
        return Account.destroy({
            where: { ...query },
            ...options
        });
    }
    static count(options = {}) {
        return Account.count(options);
    }
}

module.exports = AccountRepository;