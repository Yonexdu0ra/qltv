const { Op, where } = require("sequelize");
const bookRepository = require("../repositories/bookRepository");
const { sequelize } = require("../models");

class BookService {
  static async getAllBooks(query = {}, options = {}) {
    return bookRepository.findBooks(query, options);
  }
  static async getBooks(query, options = {}) {
    return bookRepository.findBooks(query, options);
  }
  static async getBookById(id, options = {}) {
    return bookRepository.findBookById(id, options);
  }
  static async getBookByIdWithAuthorAndGenre(id, options = {}) {
    try {
      return bookRepository.findBookByIdWithAuthorAndGenre(id, options);
    } catch (error) {
      throw error;
    }
  }
  static async getBooksWithAuthorAndGenre(query, options = {}) {
    return bookRepository.findBooksWithAuthorAndGenre(query, options);
  }
  static async getBooksPagination(options = {}) {
    const where = {};

    if (options.q) {
      where.title = {
        [Op.like]: `%${options.q}%`,
      };
    }
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

    const [sortBy, sortOrder] = options.sort
      ? options.sort.split("-")
      : ["title", "ASC"];

    const order = [
      [sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"],
    ];
    return bookRepository.findBooksPagination({ offset, limit, order, where });
  }
  static async getBooksWithAuthorsAndGenresPagination(params, options = {}) {
    let { page = 1, limit = 5, sort = "DESC" } = params;
    page = isNaN(parseInt(page)) ? 1 : parseInt(page);
    limit = isNaN(parseInt(limit)) ? 5 : parseInt(limit);
    sort = sort.toUpperCase() === "ASC" ? "ASC" : "DESC";
    const order = [["createdAt", sort]];
    const offset = (page - 1) * limit;
    const where = {};
    if (params.s) {
      where.title = { [Op.like]: `%${params.s}%` };
    }
    return bookRepository.findBooksWithAuthorsAndGenresPagination(
      { offset, limit, order, where },
      options
    );
  }
  static async createBook(data) {
    const transaction = await sequelize.transaction();
    try {
      if (!data.authors || data.authors.length === 0)
        throw new Error("Vui lòng chọn tác giả cho sách");
      if (!data.genres || data.genres.length === 0)
        throw new Error("Vui lòng chọn thể loại cho sách");
      const book = await bookRepository.createBook(data, {
        fields: [
          "title",
          "isbn",
          "published_year",
          "quantity_total",
          "quantity_available",
          "description",
          "image_cover",
        ],
        transaction,
      });
      // console.log(JSON.parse(data.genre_id));

      await book.setAuthors([...data.authors], { transaction });
      await book.setGenres([...data.genres], { transaction });
      await transaction.commit();
      return book;
    } catch (error) {
      await transaction.rollback();
      console.log(error.message);
      throw error;
    }
  }
  static async updateBook(id, data) {
    const transaction = await sequelize.transaction();
    try {
      const book = await bookRepository.findBookByIdWithAuthorAndGenre(id);

      if (!book) throw new Error("Sách không tồn tại không thể cập nhật");
      if (!data.image_cover) data.image_cover = book.image_cover;
      const isUpdated = await bookRepository.updateBook(
        { id },
        { ...data },
        {
          fields: [
            "title",
            "isbn",
            "published_year",
            "quantity_total",
            "quantity_available",
            "description",
            "image_cover",
          ],
        }
      );
      if (!isUpdated) throw new Error("Cập nhật sách thất bại");
      if (!data.authors || data.authors.length === 0)
        throw new Error("Vui lòng chọn tác giả cho sách");
      if (!data.genres || data.genres.length === 0)
        throw new Error("Vui lòng chọn thể loại cho sách");
      await book.setAuthors([...data.authors], { transaction });
      await book.setGenres([...data.genres], { transaction });
      await transaction.commit();
      return;
    } catch (error) {
      await transaction.rollback();
      console.log(error.message);

      throw error;
    }
  }
  static async deleteBook(id) {
    try {
      const book = await bookRepository.findBookWithBorrowDetail({ id });
      if (!book) throw new Error("Sách không tồn tại không thể xóa");
      if (book.borrowDetails && book.borrowDetails.length > 0)
        throw new Error("Sách đã hoặc đang được mượn không thể xóa");
      return bookRepository.deleteBook({ id });
    } catch (error) {
      throw error;
    }
  }
  static async searchBooks(query) {
    try {
      const where = {};
      if (query) {
        where.title = {
          [Op.like]: `%${query}%`,
        };
      }
      const limit = 10;
      const offset = 0;
      const order = [["title", "ASC"]];
      const options = { attributes: ["id", "title"] };
      return await bookRepository.findBooksPagination(
        { where, limit, offset, order },
        options
      );
    } catch (error) {
      throw error;
    }
  }
  static async countBooks() {
    try {
      return await bookRepository.countBooks();
    } catch (error) {
      throw error;
    }
  }
  static async decreaseBookStock(bookId, quantity = 1, options = {}) {
    try {
      const isUpdated = await bookRepository.decrementBookStock(
        "quantity_available",
        quantity,
        { id: bookId },
        { ...options }
      );
      return isUpdated;
    } catch (error) {
      throw error;
    }
  }
  static async decreaseBookStockByIds(bookIds, quantity = 1, options = {}) {
    try {
      const isUpdated = await bookRepository.decrementBookStock(
        "quantity_available",
        quantity,
        {
          id: {
            [Op.in]: bookIds,
          },
        },
        { ...options }
      );
      
      return isUpdated
    } catch (error) {
      throw error;
    }
  }
  static async increaseBookStockByIds(bookIds, quantity = 1, options = {}) {
    try {
      
      
      const isUpdated = await bookRepository.incrementBookStock(
        "quantity_available",
        quantity,
        {
          id: {
            [Op.in]: bookIds,
          },
        },
        { ...options }
      );

      return isUpdated;
    } catch (error) {
      console.log(error);
      
      throw error;
    }
  }

  static async increaseBookStock(bookId, quantity = 1, options = {}) {
    try {
      const isUpdated = await bookRepository.incrementBookStock(
        "quantity_available",
        quantity,
        { id: bookId },
        { ...options }
      );
      return isUpdated;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BookService;
