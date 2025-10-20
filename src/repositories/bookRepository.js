const { Book, Author, Genre } = require("../models");

class BookRepository {
  static findAll(query = {}, options = {}) {
    return Book.findAll({
      where: query,
      ...options
    });
  }
  static findOne(query = {}, options = {}) {
    return Book.findOne({
      where: query,
      ...options
    });
  }
  static findOneWithAuthorAndGenre(query = {}, options = {}) {
    return Book.findOne({
      where: query,
      include: [
        {
          model: Author,
          as: 'author',
          where: options.authorWhere || {},
          attributes: options.authorAttributes || [],
        },
        {
          model: Genre,
          as: 'genre',
          where: options.genreWhere || {},
          attributes: options.genreAttributes || [],
        }
      ],
      ...options
    });
  }
  static findByPk(id, options = {}) {
    return Book.findByPk(id, options);
  }
  static findAllAndCount(query = {}, options = {}) {
    return Book.findAndCountAll({
      where: query,
      ...options
    });
  }
  static findWithPagination(query = {}, options = {}) {
    return Book.findAndCountAll({
      where: query.where || {},
      limit: query.limit || 10,
      offset: query.offset || 0,
      order: query.order || [],
      ...options
    });
  }
  static findWithAuthorAndGenrePagination(query = {}, options = {}) {
    return Book.findAndCountAll({
      where: query.where || {},
      limit: query.limit || 10,
      offset: query.offset || 0,
      order: query.order || [],
      include: [
        {
          model: Author,
          as: 'author',
          where: options.authorWhere || {},
          attributes: options.authorAttributes || [],
        },
        {
          model: Genre,
          as: 'genre',
          where: options.genreWhere || {},
          attributes: options.genreAttributes || [],
        }
      ],
      ...options
    });
  }

  static create(data, options = {}) {
    return Book.create(data, options);
  }
  static update(data, query = {}, options = {}) {
    return Book.update(data, {
      where: query,
      ...options
    });
  }
  static delete(query = {}, options = {}) {
    return Book.destroy({
      where: query,
      ...options
    });
  }
  static countBooks(options = {}) {
    return Book.count(options);
  }
}

module.exports = BookRepository;
