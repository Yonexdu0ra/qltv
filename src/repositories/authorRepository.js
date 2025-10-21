const { Author, Book } = require("../models");

class AuthorRepository {
  static findAll(query = {}, options = {}) {
    return Author.findAll({
      where: query,
      ...options,
    });
  }
  static findOne(query = {}, options = {}) {
    return Author.findOne({
      where: query,
      ...options,
    });
  }
  static findOneWithBooks(query = {}, options = {}) {
    return Author.findOne({
      where: { ...query },
      ...options,
      include: [
        {
          required: options.bookRequired || false,
          model: Book,
          as: "books",
          where: options.bookWhere ,
          attributes: options.bookAttributes ,
          through: { attributes: options.throughAttributes  },
        },
      ],
    });
  }
  static findOneWithBooksPagination(query = {}, options = {}) {
    return Author.findOne({
      where: { ...query },
      ...options,
      include: [
        {
          model: Book,
          as: "books",
          required: options.bookRequired || false,
          where: options.bookWhere ,
          attributes: options.bookAttributes ,
          through: { attributes: options.throughAttributes  },
          limit: options.bookLimit ,
          offset: options.bookOffset ,
          order: options.bookOrder ,
        },
      ],
    });
  }
  static findByPk(id, options = {}) {
    return Author.findByPk(id, options);
  }
  static findAllAndCount(query = {}, options = {}) {
    return Author.findAndCountAll({
      where: query,
      ...options,
    });
  }
  static findAllWithBooks(query = {}, options = {}) {
    return Author.findAll({
      where: query,
      include: [
        {
          model: Book,
          as: "books",
          where: options.bookWhere ,
          attributes: options.bookAttributes ,
          through: { attributes: options.throughAttributes  },
        },
      ],
      ...options,
    });
  }
  static findWithPagination(query = {}, options = {}) {
    return Author.findAndCountAll({
      where: { ...query } ,
      limit: options.limit ,
      offset: options.offset ,
      order: options.order ,
      ...options,
    });
  }
  static findWithBookPagination(query = {}, options = {}) {
    return Author.findAndCountAll({
      where: { ...query } ,
      limit: query.limit ,
      offset: query.offset ,
      order: query.order ,
      ...options,
      include: [
        {
          model: Book,
          as: "books",
          where: options.bookWhere ,
          attributes: options.bookAttributes ,
          through: { attributes: options.throughAttributes  },
        },
      ],
    });
  }
  static create(data, options = {}) {
    return Author.create(data, options);
  }
  static update(data, query = {}, options = {}) {
    return Author.update(data, {
      where: query,
      ...options,
    });
  }
  static delete(query = {}, options = {}) {
    return Author.destroy({
      where: query,
      ...options,
    });
  }
  static count(options = {}) {
    return Author.count({
      ...options,
    });
  }
}

module.exports = AuthorRepository;
