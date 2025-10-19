const fineRepository = require("../repositories/fineRepository");

class FineServices {
  static async getFines(query, options) {
    return fineRepository.findFines(query, options);
  }
  static async getFinesPagination(query) {
    const where = {};
    if (query) {
      where.status = {
        [Op.like]: `%${query}%`,
      };
    }
    const limit = 10;
    const offset = 0;
    const order = [["amount", "ASC"]];
    const options = {
      attributes: ["id", "amount", "status", "borrow_detail_id"],
    };
    return fineRepository.findFinesPagination(
      where,
      limit,
      offset,
      order,
      options
    );
  }
  static async getFineByIdWithBookAndBorrower(id) {
    return fineRepository.findFineByIdWithBookAndBorrower(id);
  }
  static async getFinesPaginationWithBorrowAndBorrower(query) {
    const where = {};
    if (query) {
      where.status = {
        [Op.like]: `%${query}%`,
      };
    }
    const limit = 10;
    const offset = 0;
    const order = [["amount", "ASC"]];
    const options = {
      attributes: ["id", "amount", "status", "borrow_detail_id"],
    };
    return fineRepository.findFinesPaginationWithBorrowDetailAndBorrower(
      where,
      limit,
      offset,
      order,
      options
    );
  }
  static async getFine(id, options) {
    return fineRepository.findFine(id, options);
  }
  static async getFineById(id, options) {
    try {
    return fineRepository.findFine({ id }, options);
    } catch (error) {
      console.log(error);
      throw error;
    }
    
  }
  static async createFine(data, options) {
    return fineRepository.createFine(data, options);
  }
  static async createFines(data, options) {
    return fineRepository.createFines(data, options);
  }
  static async updateFine(id, data, options) {
    return fineRepository.updateFine(id, data, options);
  }
  static async markAsPaidFineById(id, options) {
    try {
      const [isUpdated] = await fineRepository.updateFine(
        { id },
        { is_paid: true },
        {
          fields: ["is_paid"],
          ...options,
        }
      );
      return isUpdated > 0;
    } catch (error) {
      console.log(error.message);
      
      throw error;
    }
  }
}

module.exports = FineServices;
