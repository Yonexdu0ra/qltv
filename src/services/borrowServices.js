const { Op } = require("sequelize");
const { sequelize } = require("../models");
const { borrowRepository } = require("../repositories");
const { BORROW_STATUS_CONSTANTS } = require("../utils/constants");

class BorrowServices {
  static markAsReturnedBorrowById(id, options = {}) {
    return borrowRepository.update(
      { status: BORROW_STATUS_CONSTANTS.RETURNED, return_date: new Date() },
      { id },
      { ...options }
    );
  }
  static async markAsBorrowedBorrowById(id, options = {}) {
    return borrowRepository.update(
      { status: BORROW_STATUS_CONSTANTS.BORROWED, pickup_date: new Date() },
      { id },
      { ...options }
    );
  }
  static async markAsApprovedBorrowById(id, options = {}) {
    return borrowRepository.update(
      { status: BORROW_STATUS_CONSTANTS.APPROVED, pickup_date: new Date() },
      { id },
      { ...options }
    );
  }
  static async markAsRejectedBorrowById(id, options = {}) {
    return borrowRepository.update(
      { status: BORROW_STATUS_CONSTANTS.REJECTED },
      { id },
      { ...options }
    );
  }
  static async markAsCancelledBorrowById(id, options = {}) {
    return borrowRepository.update(
      { status: BORROW_STATUS_CONSTANTS.CANCELLED },
      { id },
      { ...options }
    );
  }
  static async markAsExpiredBorrowById(id, options = {}) {
    return borrowRepository.update(
      { status: BORROW_STATUS_CONSTANTS.EXPIRED },
      { id },
      { ...options }
    );
  }
  static async createBorrow(data, options = {}) {
    
    const borrow = await borrowRepository.create(data, {
      ...options,
    });

    // for (const book_id of books) {
    //   const borrowDetail = await borrow.addBook(parseInt(book_id), {
    //     through: {
    //       status: "BORROWED",
    //     },
    //     ...options,
    //   });
    // }
    return borrow;
  }
  static async updateBorrowById(data, id, options = {}) {
    return borrowRepository.update(data, { id }, options);
  }
  static async deleteBorrowById(id, options = {}) {
    return borrowRepository.delete({ id }, options);
  }
  static async getBorrowById(id, options = {}) {
    return borrowRepository.findByPk(id, { ...options });
  }
  static async getBorrowByIdWithBorrowDetails(id, options = {}) {
    return borrowRepository.findOneWithBorrowDetails({ id}, { ...options });
  }
  static async getBorrowByIdWithBorrowerAndApproverAndBooks(id, options = {}) {
    return borrowRepository.findOneWithBorrowerAndApproverAndBook(
      { id },
      { ...options }
    );
  }
  static async getAllBorrowByIdWithBorrowerAndApproverAndBooks(id, options = {}) {
    return borrowRepository.findAllWithBorrowerAndApproverAndBookPagination(
      { id },
      { ...options }
    );
  }
  static async getAllBorrowWithBorrowerAndApproverAndBooks(query, options = {}) {
    const where = {  };
    const bookWhere = {};
    if (query.q) {
      bookWhere.title = {
        [Op.like]: `%${query.q}%`,
      };
    }
    const limit = options.limit
      ? options.limit > 0
        ? parseInt(options.limit)
        : 10
      : 10;
    const page = options.page
      ? options.page > 0
        ? parseInt(options.page)
        : 1
      : 1;
    const offset = (page - 1) * limit;
    const [sortBy, sortOrder] = options.sort
      ? options.sort.split("-")
      : ["created_at", "ASC"];
    const order = [
      [
        sortBy || "created_at",
        sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ],
    ];
    if (
      ["BORROWED", "APPROVED", "REJECTED", "CANCELLED", "RETURNED"].includes(
        sortBy
      ) &&
      sortOrder
    ) {
      where.status = { [Op.eq]: sortBy };
      order[0] = [
        "created_at",
        sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ];
    }

    return borrowRepository.findAllWithBorrowerAndApproverAndBookPagination(
      where,
      { ...options, bookWhere, limit, offset, order }
    );
  }

  static async getAllBorrowByBorrowerIdWithBorrowerAndApproverAndBooks(
    borrower_id,
    query,
    options = {}
  ) {
    const where = { borrower_id };
    const bookWhere = {};
    if (query.q) {
      bookWhere.title = {
        [Op.like]: `%${query.q}%`,
      };
    }
    const limit = options.limit
      ? options.limit > 0
        ? parseInt(options.limit)
        : 10
      : 10;
    const page = options.page
      ? options.page > 0
        ? parseInt(options.page)
        : 1
      : 1;
    const offset = (page - 1) * limit;
    const [sortBy, sortOrder] = options.sort
      ? options.sort.split("-")
      : ["created_at", "ASC"];
    const order = [
      [
        sortBy || "created_at",
        sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ],
    ];
    if(["BORROWED", "APPROVED", "REJECTED", "CANCELLED", "RETURNED"].includes(sortBy) && sortOrder) {
      where.status = { [Op.eq]: sortBy };
      order[0] = [
        "created_at",
        sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ];
    }

    return borrowRepository.findAllWithBorrowerAndApproverAndBookPagination(
      where,
      { ...options, bookWhere, limit, offset, order }
    );
  }
  static async getBorrowsWithBorrowerAndApproverAndBookPagination(
    query = {},
    options = {}
  ) {
    const where = {};
    const bookWhere = {};
    if (query.q) {
      bookWhere.title = {
        [Op.like]: `%${query.q}%`,
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
      : ["created_at", "ASC"];
    const order = [
      [
        sortBy || "created_at",
        sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ],
    ];
    if (
      ["BORROWED", "APPROVED", "REJECTED", "CANCELLED", "RETURNED"].includes(
        sortBy
      ) &&
      sortOrder
    ) {
      where.status = { [Op.eq]: sortBy };
      order[0] = [
        "created_at",
        sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ];
    }
    return borrowRepository.findAllWithBorrowerAndApproverAndBookPagination(
      where,
      { bookWhere, limit, offset, order, ...options }
    );
  }
}

module.exports = BorrowServices;
