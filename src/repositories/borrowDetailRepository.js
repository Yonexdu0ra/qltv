const { BorrowDetail, User, Book, Borrow, Fine } = require("../models");

class BorrowDetailRepository {
  static findAll(query, options = {}) {
    return BorrowDetail.findAll({
      where: query,
      ...options,
    });
  }
  static findAllWithBorrow(query, options = {}) {
    return BorrowDetail.findAll({
      where: query,
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes,
        },
      ],
    });
  }
  static findAllWithBorrowAndBorrowerAndApproverAndBook(query, options = {}) {
    return BorrowDetail.findAll({
      where: query,
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes,
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
        },
        {
          model: Book,
          as: "book",
          attributes: options.bookAttributes,
          where: options.bookWhere,
        },
      ],
    });
  }
  static findAllWithBorrowAndBorrowerAndApprover(query, options = {}) {
    return BorrowDetail.findAll({
      where: query,
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes,
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
        },
      ],
    });
  }
  static findAllWithBorrowAndBorrower(query, options = {}) {
    return BorrowDetail.findAll({
      where: query,
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes,
          include: [
            {
              model: User,
              as: "borrower",
              attributes: options.borrowerAttributes,
              where: options.borrowerWhere,
            },
          ],
        },
      ],
    });
  }

  static findAllWithBorrowAndBookPanigation(query, options = {}) {
    return BorrowDetail.findAndCountAll({
      where: { ...query },
      ...options,
      distinct: true,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes,

        },
        {
          model: Book,
          as: "book",
          attributes: options.bookAttributes,
          where: options.bookWhere,
        },
      ],
    });
  }
  static findAllWithBorrowPanigation(query, options = {}) {
    return BorrowDetail.findAndCountAll({
      where: { ...query },
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes
        },
      ],
    });
  }

  static findAllWithBorrowAndBorrowerAndApproverPanigation(
    query,
    options = {}
  ) {
    return BorrowDetail.findAndCountAll({
      where: { ...query },
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes,
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
        },
      ],
    });
  }
  static findAllWithBorrowAndBorrowerPanigation(query, options = {}) {
    return BorrowDetail.findAndCountAll({
      where: { ...query },
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes,
          include: [
            {
              model: User,
              as: "borrower",
              attributes: options.borrowerAttributes,
              where: options.borrowerWhere,
            },
          ],
        },
      ],
    });
  }

  static findOne(query, options = {}) {
    return BorrowDetail.findOne({
      where: { ...query },
      ...options,
    });
  }
  static findOneWithFine(query, options = {}) {
    return BorrowDetail.findOne({
      where: { ...query },
      ...options,
      include: [{
        model: Fine,
        as: "fine",
        attributes: options.fineAttributes,
        where: options.fineWhere,
      }]
    });
  }
  static findOneWithBorrow(query, options = {}) {
    return BorrowDetail.findOne({
      where: query,
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes,
        },
      ],
    });
  }
  static findOneWithBorrowAndBorrowerAndApproverAndBook(query, options = {}) {
    return BorrowDetail.findOne({
      where: query,
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes,
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
            ,
          ],
        },
        {
          model: Book,
          as: "book",
          attributes: options.bookAttributes,
          where: options.bookWhere,
        }
      ],
    });
  }
  static findOneWithBorrowAndBorrowerAndApprover(query, options = {}) {
    return BorrowDetail.findOne({
      where: query,
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes,
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
        },
      ],
    });
  }
  static findOneWithBorrowAndBorrower(query, options = {}) {
    return BorrowDetail.findOne({
      where: query,
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes,
          include: [
            {
              model: User,
              as: "borrower",
              attributes: options.borrowerAttributes,
              where: options.borrowerWhere,
            },
          ],
        },
      ],
    });
  }
  static findOneWithBorrowAndBook(query, options = {}) {
    return BorrowDetail.findOne({
      where: query,
      ...options,
      include: [
        {
          model: Borrow,
          as: "borrow",
          where: options.borrowWhere,
          attributes: options.borrowAttributes,

        },
        {
          model: Book,
          as: "book",
          attributes: options.bookAttributes,
          where: options.bookWhere,
        },
      ],
    });
  }

  static findByPk(id, options = {}) {
    return BorrowDetail.findByPk(id, options);
  }

  static findAllAndCount(query, options = {}) {
    return BorrowDetail.findAndCountAll({
      where: query,
      ...options,
    });
  }

  static count(query, options = {}) {
    return BorrowDetail.count({
      where: query,
      ...options,
    });
  }

  static create(data, options = {}) {
    return BorrowDetail.create(data, options);
  }
  static createMany(dataArray, options = {}) {
    return BorrowDetail.bulkCreate(dataArray, options);
  }
  static update(data, query, options = {}) {
    return BorrowDetail.update(data, {
      where: query,
      ...options,
    });
  }
  static delete(query, options = {}) {
    return BorrowDetail.destroy({
      where: query,
      ...options,
    });
  }
  static bulkCreate(dataArray, options = {}) {
    return BorrowDetail.bulkCreate(dataArray, { ...options });
  }
}

module.exports = BorrowDetailRepository;
