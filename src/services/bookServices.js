const { Op } = require("sequelize");
const { bookRepository } = require("../repositories");
const { sequelize } = require("../models");
const genareteSlug = require("../utils/genareteSlug");
class BookService {
  static async getBooksByTitle(title, options = {}) {
    const where = {
      title: {
        [Op.like]: `%${title || ""}%`
      }
    }
    const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
    const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
    const offset = (page - 1) * limit
    const order = [["created_at", "DESC"]]
    const books = await bookRepository.findAllAndCount({ where }, { limit, offset, order, ...options });
    return books;
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
    return bookRepository.findOneWithAuthorAndGenre(id, { ...options });
  }
  static async getBooksWithPagination(query = {}, options = {}) {
    const where = {}
    if (query.q) {
      where.title = {
        [Op.like]: `%${query.q || ""}%`
      }
    }
    const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
    const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
    const offset = (page - 1) * limit
    const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["created_at", "ASC"]
    const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
    return bookRepository.findWithPagination(where, { limit, offset, order, ...options });
  }
  static async getBooksWithAuthorsAndGenresPagination(query = {}, options = {}) {
    const where = {}
    const authorWhere = {}
    const genreWhere = {}
    if (query.q) {
      where.title = {
        [Op.like]: `%${query.q || ""}%`
      }
      authorWhere.name = {
        [Op.like]: `%${query.q || ""}%`
      }
      genreWhere.name = {
        [Op.like]: `%${query.q || ""}%`
      }
    }
    const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
    const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
    const offset = (page - 1) * limit
    const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["created_at", "ASC"]
    const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
    return bookRepository.findWithAuthorAndGenrePagination(where, { authorWhere, genreWhere, limit, offset, order, ...options });
  }
  static async createBook(data, options = {}) {
    return bookRepository.create(data, { ...options })
  }
  static async updateBookById(data, id, options = {}) {
    return bookRepository.update(data, { id }, options);
  }
  static async deleteBookById(id, options = {}) {
    return bookRepository.delete({ id }, options);
  }
  static async decrementBook(field, by = 1, query = {}, options = {}) {
    return bookRepository.decrement(field, by, query, options);
  }
  static async incrementBook(field, by = 1, query = {}, options = {}) {
    return bookRepository.increment(field, by, query, options);
  }
}

module.exports = BookService;
