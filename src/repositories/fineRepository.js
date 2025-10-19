const { Fine, Borrow, BorrowDetail, User, Book } = require("../models");

class FineRepository {
  static async findFines(query = {}, options = {}) {
    return Fine.findAll({ where: query, ...options });
  }
  static async findFine(query, options = {}) {
    return Fine.findOne({ where: { ...query }, ...options });
  }
  static async findFinesPagination(
    { offset = 0, limit = 10, order = [["createdAt", "DESC"]], where = {} },
    options = {}
  ) {
    return Fine.findAndCountAll({
      where,
      offset,
      limit,
      order,
      distinct: true,
      ...options,
    });
  }
  static async findFinesPaginationWithBorrowDetailAndBorrower(
    { offset = 0, limit = 10, order = [["createdAt", "DESC"]], where = {} },
    options = {}
  ) {
    return Fine.findAndCountAll({
      where,
      offset,
      limit,
      order,
      distinct: true,
      include: [
        {
          model: BorrowDetail,
          as: "borrowDetail",
          ...options.borrowDetailOptions,
          include: [
            {
              model: Book,
              as: "book",
            },
            {
              model: Borrow,
              as: "borrow",
              include: [
                {
                  model: User,
                  as: "borrower",
                },
              ],
            },
          ],
        },
      ],
      ...options,
    });
  }
  static async findFineByIdWithBookAndBorrower(id) {
    return Fine.findOne({
      where: { id },
      include: [
        {
          model: BorrowDetail,
          as: "borrowDetail",
          include: [
            {
              model: Book,
              as: "book",
            },
            {
              model: Borrow,
              as: "borrow",
              include: [
                {
                  model: User,
                  as: "borrower",
                },
              ],
            },
          ],
        },
      ],
    });
  }
  static async countFines(query = {}, options = {}) {
    return Fine.count({ where: query, ...options });
  }
  static async createFine(data, options = {}) {
    return Fine.create(data, { ...options });
  }
  static async createFines(data, options = {}) {
    return Fine.bulkCreate(data, {
      ...options,
      fields: ["amount", "status", "borrow_detail_id"],
    });
  }
  static async updateFine(query, data, options = {}) {
    return Fine.update(data, { where: { ...query } }, { ...options });
  }
}

module.exports = FineRepository;
