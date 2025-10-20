const fineRepository = require("../repositories/fineRepository");

class FineServices {
  static async getAllFines(query, options) {
    const where = {};
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
      [sortBy || "created_at", sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"],
    ];
    if (["is_paid"].includes(sortBy) && sortOrder) {
      where.is_paid = { [Op.eq]: sortBy };
      order[0] = ["created_at", sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"];
    }
    return fineRepository.findAll(where, { ...options, limit, offset, order });
  }

  static getFineByIdWithBorrowDetailAndBorrowerAndBook(id, options) {
    return fineRepository.findOneWithBorrowDetailAndBorrowerAndBook({ id }, { ...options });
  }
  static getAllFinesWithBorrowDetailAndBorrowerAndBookPagination(query, options) {
    const where = {};
    const bookWhere = {};
    if (query.q) {
      bookWhere.title = {
        [Op.like]: `%${query.q}%`,
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
      [sortBy || "created_at", sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"],
    ];
    if (["is_paid"].includes(sortBy) && sortOrder) {
      where.is_paid = { [Op.eq]: sortBy };
      order[0] = ["created_at", sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"];
    }
    return fineRepository.findAllWithBorrowDetailAndBorrowerAndBookPagination(where, { ...options, limit, offset, order, bookWhere });
  }
  static async getFineById(id, options) {
    return fineRepository.findByPk(id, options);

  }
  static async createFine(data, options) {
    return fineRepository.create(data, options);
  }
  static async createFines(data, options = {}) {
    return fineRepository.createMany(data, { ...options, fields: ['amount', 'is_paid', 'note', 'borrow_detail_id'] });
  }
  static async updateFineById(data, id, options = {}) {
    return fineRepository.update(data, { id }, { fields: ['amount', 'is_paid', 'note'], ...options });
  }
  static async markAsPaidFineById(id, options = {}) {
    const [updatedRow] = await fineRepository.update(
      { is_paid: true },
      { id },
      {

        ...options,
      }
    );
    return updatedRow > 0;
  }
}

module.exports = FineServices;
