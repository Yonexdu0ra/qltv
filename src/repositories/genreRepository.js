const { Genre, Book } = require("../models");

class GenreRepository {
    static findAll(query, options = {}) {
        return Genre.findAll({
            where: query,
            ...options
        })
    }
    static findOne(query, options = {}) {
        return Genre.findOne({
            where: query,
            ...options
        })
    }
    static findOneWithBooks(query, options = {}) {
        return Genre.findOne({
            where: query,
            ...options,
            include: [
                {
                    model: Book,
                    as: 'books',
                    attributes: options.bookAttributes || [],
                    where: options.bookWhere || {}
                }
            ]
        })
    }
    static findAllAndCount(query, options = {}) {
        return Genre.findAndCountAll({
            where: query,
            ...options
        })
    }
    static findAllWithBooksPagination(query, options = {}) {
        return Genre.findAndCountAll({
            where: query,
            ...options,
            include: [
                {
                    model: Book,
                    as: 'books',
                    attributes: options.bookAttributes || [],
                    where: options.bookWhere || {}
                }
            ]
        })
    }
    static findByPk(id, options = {}) {
        return Genre.findByPk(id, options);
    }
    static create(data, options = {}) {
        return Genre.create(data, options);
    }
    static count(query, options = {}) {
        return Genre.count({
            where: query,
            ...options
        });
    }
    static update(data, query, options = {}) {
        return Genre.update(data, {
            where: query,
            ...options
        });
    }
    static delete(query, options = {}) {
        return Genre.destroy({
            where: query,
            ...options
        });
    }

}

module.exports = GenreRepository;