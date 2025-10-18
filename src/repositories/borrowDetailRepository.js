const { BorrowDetail, User, Book } = require("../models");

class BorrowDetailRepository {
  static async createBorrowDetail(data, options = {}) {
    return BorrowDetail.create(data, options);
  }
  static async findBorrowDetailsPaginated(
    { where, offset = 0, limit = 5, order = [["createdAt", "DESC"]] },
    options = {}
  ) {
    return BorrowDetail.findAndCountAll({
      where,
      offset,
      limit,
      order,
      ...options,
    });
  }
  static async findBorrowDetailsPaginatedWithBorrowAndBorrower(
    { where, offset = 0, limit = 5, order = [["createdAt", "DESC"]] },
    options = {}
  ) {
    return BorrowDetail.findAndCountAll({
      where,
      offset,
      limit,
      order,
      include: [
        {
          model: User,
          as: "borrower",
          where: {
            ...(options.borrowerWhere || {}),
          },
        },
        {
          model: User,
          as: "approver",
          where: {
            ...(options.approverWhere || {}),
          },
        },
      ],
      distinct: true,
      ...options,
    });
  }
  static async findBorrowDetailsPaginatedWithBook(
    { where, offset = 0, limit = 5, order = [["createdAt", "DESC"]] },
    options = {}
  ) {
    console.log(options);
    
    return BorrowDetail.findAndCountAll({
      where,
      offset,
      limit,
      order,
      include: [
        {
          model: Book,
          as: "book",
          where: {
            ...(options.bookWhere || {}),
          },
        },
      ],
      distinct: true,
      ...options,
    });
  }
}

module.exports = BorrowDetailRepository;
