const { Account, User } = require("../models");
class AccountRepository {
    static findAll(query = {}, options = {}) {
        return Account.findAll({
            where: query,
            ...options
        });
    }
    static findOne(query = {}, options = {}) {
        return Account.findOne({
            where: query,
            ...options
        });
    }
    static findByPk(id, options = {}) {
        return Account.findByPk(id, options);
    }
    static findAllAndCount(query = {}, options = {}) {
        return Account.findAndCountAll({
            where: query,
            ...options
        });
    }
    static findWithPagination(query = {}, options = {}) {
        return Account.findAndCountAll({
            where: query.where || {},
            limit: query.limit || 10,
            offset: query.offset || 0,
            order: query.order || [],
            ...options
        });
    }
    static findWithUserPagination(query = {}, options = {}) {
        return Account.findAndCountAll({
            where: query.where || {},
            limit: query.limit || 10,
            offset: query.offset || 0,
            order: query.order || [],
            ...options,
            include: [{
                model: User,
                as: 'user',
                where: options.userWhere || {},
                attributes: options.userAttributes || [],
                through: { attributes: options.throughAttributes || [] }
            }]
        });
    }
    static create(data, options = {}) {
        return Account.create(data, options);
    }
    static update(data, query = {}, options = {}) {
        return Account.update(data, {
            where: query,
            ...options
        });
    }
    static delete(query = {}, options = {}) {
        return Account.destroy({
            where: query,
            ...options
        });
    }
    static count (options = {}) {
        return Account.count(options);
    }
}

module.exports = AccountRepository;