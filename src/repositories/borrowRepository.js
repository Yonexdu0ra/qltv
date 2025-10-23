const { Borrow, Book, User, BorrowDetail, Fine } = require("../models");

class BorrowRepository {
  static findAll(query, options = {}) {
    return Borrow.findAll({
      where: query,
      ...options,
    });
  }
  static findOne(query, options = {}) {
    return Borrow.findOne({
      where: query,
      ...options,
    });
  }
  static findOneWithBorrowDetails(query, options = {}) {
    return Borrow.findOne({
      where: query,
      ...options,
      include: [
        {
          model: BorrowDetail,
          as: "borrowDetails",
          attributes: options.borrowDetailAttributes,
          where: options.borrowDetailWhere,
        },
      ],
    });
  }
  static findOneWithBorrowDetailsAndFine(query, options = {}) {
    return Borrow.findOne({
      where: query,
      ...options,
      include: [
        {
          model: BorrowDetail,
          as: "borrowDetails",
          attributes: options.borrowDetailAttributes,
          where: options.borrowDetailWhere,
          include: [
            {
              model: Fine,
              as: "fine",
              attributes: options.fineAttributes,
              where: options.fineWhere,
            },
          ],
        },
      ],
    });
  }
  static findAllAndCount(query, options = {}) {
    return Borrow.findAndCountAll({
      where: query,
      ...options,
    });
  }

  static findOneWithBorrowerAndApproverAndBook(query, options = {}) {
    return Borrow.findOne({
      where: query,
      ...options,
      include: [
        {
          model: User,
          as: "borrower",
          attributes: options.borrowerAttributes,
          where: options.borrowerWhere,
        },
        {
          model: User,
          as: "approver",
          attributes: options.approverAttributes,
          where: options.approverWhere,
        },
        {
          model: BorrowDetail,
          as: "borrowDetails",
          attributes: options.borrowDetailAttributes,
          where: options.borrowDetailWhere,
          include: [
            {
              model: Book,
              as: "book",
              attributes: options.bookAttributes,
              where: options.bookWhere,
            },
          ],
        },
      ],
    });
  }
  static findOneWithBorrowerAndApprover(query, options = {}) {
    return Borrow.findOne({
      where: query,
      ...options,
      include: [
        {
          model: User,
          as: "borrower",
          attributes: options.borrowerAttributes,
          where: options.borrowerWhere,
        },
        {
          model: User,
          as: "approver",
          attributes: options.approverAttributes,
          where: options.approverWhere,
        },
      ],
    });
  }
  static findOneWithBook(query, options = {}) {
    return Borrow.findOne({
      where: query,
      ...options,
      include: [
        {
          model: BorrowDetail,
          as: "borrowDetails",
          attributes: options.borrowDetailAttributes,
          where: options.borrowDetailWhere,
          include: [
            {
              model: Book,
              as: "book",
              attributes: options.bookAttributes,
              where: options.bookWhere,
            },
          ],
        },
      ],
    });
  }

  static findAllWithBorrowerAndApproverAndBookPagination(query, options = {}) {
    return Borrow.findAndCountAll({
      where: query,
      ...options,
      distinct: true,
      include: [
        {
          model: User,
          as: "borrower",
          attributes: options.borrowerAttributes,
          where: options.borrowerWhere,
        },
        {
          model: User,
          as: "approver",
          attributes: options.approverAttributes,
          where: options.approverWhere,
        },
        {
          model: BorrowDetail,
          as: "borrowDetails",
          attributes: options.borrowDetailAttributes,
          where: options.borrowDetailWhere,
          include: [
            {
              model: Book,
              as: "book",
              attributes: options.bookAttributes,
              where: options.bookWhere,
            },
          ],
        },
      ],
    });
  }
  static findByPk(id, options = {}) {
    return Borrow.findByPk(id, options);
  }

  static create(data, options = {}) {
    return Borrow.create(data, options);
  }
  static update(data, query, options = {}) {
    return Borrow.update(data, { where: query, ...options });
  }
  static delete(query, options = {}) {
    return Borrow.destroy({ where: query, ...options });
  }
  static count(query, options = {}) {
    return Borrow.count({ where: query, ...options });
  }
}

module.exports = BorrowRepository;
