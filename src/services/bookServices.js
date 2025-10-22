const { Op } = require("sequelize");
const { bookRepository } = require("../repositories");
const { sequelize } = require("../models");
const genareteSlug = require("../utils/generateSlug");
class BookService {
  static async getBooksByTitle(title, options = {}) {
    const where = {
      title: {
        [Op.like]: `%${title || ""}%`,
      },
    };
    const limit = options.limit
      ? options.limit > 0
        ? parseInt(options.limit)
        : 10
      : 10;
    const page =
      isNaN(parseInt(options.page)) || parseInt(options.page) < 1
        ? 1
        : parseInt(options.page);
    const offset = (page - 1) * limit;
    const order = [["created_at", "DESC"]];
    const books = await bookRepository.findAllAndCount(
      { where },
      { limit, offset, order, ...options }
    );
    return books;
  }
  static async getAllBookByIds(ids = [], options = {}) {
    return bookRepository.findAll({ id: { [Op.in]: ids } }, { ...options });
  }
  static async getBookBySlug(slug, options = {}) {
    return bookRepository.findOne({ slug }, { ...options });
  }
  static async getBookBySlugWithAuthorsAndGenres(slug, options = {}) {
  
    return bookRepository.findOneWithAuthorAndGenre({ slug }, { ...options });
  }
  static async getBookById(id, options = {}) {
    return bookRepository.findByPk(id, { ...options });
  }
  static async getBookByIdWithAuthorsAndGenres(id, options = {}) {
    return bookRepository.findOneWithAuthorAndGenre({ id }, { ...options });
  }
  static async getBooksWithPagination(query = {}, options = {}) {
    const where = {};
    if (query.q) {
      where.title = {
        [Op.like]: `%${query.q || ""}%`,
      };
    }
    const limit = options.limit
      ? options.limit > 0
        ? parseInt(options.limit)
        : 12
      : 12;
    const page =
      isNaN(parseInt(query.page)) || parseInt(query.page) < 1
        ? 1
        : parseInt(query.page);
    const offset = (page - 1) * limit;
    const [sortBy, sortOrder] = query.sort
      ? query.sort.split("-")
      : ["created_at", "ASC"];
    const order = [
      [sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"],
    ];
    
    
    return bookRepository.findWithPagination(where, {
      limit,
      offset,
      order,
      ...options,
    });
  }
  static async getBooksWithAuthorPagination(query = {}, options = {}) {
    const where = {};
    if (query.q) {
      where.title = {
        [Op.like]: `%${query.q || ""}%`,
      };
    }
    const limit = options.limit
      ? options.limit > 0
        ? parseInt(options.limit)
        : 10
      : 10;
    const page =
      isNaN(parseInt(query.page)) || parseInt(query.page) < 1
        ? 1
        : parseInt(query.page);
    const offset = (page - 1) * limit;
    const [sortBy, sortOrder] = query.sort
      ? query.sort.split("-")
      : ["created_at", "ASC"];
    const order = [
      [sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"],
    ];
    
    
    return bookRepository.findWithAuthorPagination(where, {
      limit,
      offset,
      order,
      ...options,
    });
  }
  static async getBooksWithGenresPagination(query = {}, options = {}) {
    const where = {};
    if (query.q) {
      where.title = {
        [Op.like]: `%${query.q || ""}%`,
      };
    }
    const limit = options.limit
      ? options.limit > 0
        ? parseInt(options.limit)
        : 10
      : 10;
    const page =
      isNaN(parseInt(query.page)) || parseInt(query.page) < 1
        ? 1
        : parseInt(query.page);
    const offset = (page - 1) * limit;
    const [sortBy, sortOrder] = query.sort
      ? query.sort.split("-")
      : ["created_at", "ASC"];
    const order = [
      [sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"],
    ];
    
    
    return bookRepository.findWithGenrePagination(where, {
      limit,
      offset,
      order,
      ...options,
    });
  }
  static async getBooksWithAuthorsAndGenresPagination(
    query = {},
    options = {}
  ) {
    const where = {};
    const authorWhere = {};
    const genreWhere = {};
    if (query.q) {
      where.title = {
        [Op.like]: `%${query.q || ""}%`,
      };
      authorWhere.name = {
        [Op.like]: `%${query.q || ""}%`,
      };
      genreWhere.name = {
        [Op.like]: `%${query.q || ""}%`,
      };
    }
    const limit = query.limit
      ? query.limit > 0
        ? parseInt(query.limit)
        : 10
      : 10;
    const page =
      isNaN(parseInt(query.page)) || parseInt(query.page) < 1
        ? 1
        : parseInt(query.page);
    const offset = (page - 1) * limit;
    const [sortBy, sortOrder] = query.sort
      ? query.sort.split("-")
      : ["created_at", "ASC"];
    const order = [
      [sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"],
    ];
    return bookRepository.findWithAuthorAndGenrePagination(where, {
      authorWhere,
      genreWhere,
      limit,
      offset,
      order,
      ...options,
    });
  }
  static async createBook(data, options = {}) {
    return bookRepository.create(data, { ...options });
  }
  static async updateBookById(data, id, options = {}) {
    return bookRepository.update(data, { id }, options);
  }
  static async deleteBookById(id, options = {}) {
    return bookRepository.delete({ id }, options);
  }
  static async decrementBookByIds(field, by = 1, ids = [], options = {}) {
    bookRepository.decrement(
      field,
      by,
      { id: { [Op.in]: ids } },
      options
    );
    return true;
  }
  static async decrementBookById(field, by = 1, id, options = {}) {
    return bookRepository.decrement(field, by, { id }, options);
  }
  static async incrementBookById(field, by = 1, id, options = {}) {
    return bookRepository.increment(field, by, { id }, options);
  }
  static async incrementBookByIds(field, by = 1, ids = [], options = {}) {
    return bookRepository.increment(field, by, { id: { [Op.in]: ids } }, options);
  }
  static async countBooks(where = {}) {
    return bookRepository.count(where);
  }
}

module.exports = BookService;
