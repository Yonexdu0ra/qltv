const { Op } = require("sequelize");
const borrowDetailRepository = require("../repositories/borrowDetailRepository");

class BorrowDetailServices {
  static async createBorrowDetail(data, options = {}) {
    try {
      const borrowDetail = await borrowDetailRepository.createBorrowDetail(
        data,
        {
          ...options,
          include: [{ model: Book, as: "book" }],
        }
      );
      return borrowDetail;
    } catch (error) {
      throw new Error("Error creating borrow detail");
    }
  }
  static async searchBorrowDetailsWithBookPaginated(params, options = {}) {
    try {
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
        : ["createdAt", "ASC"];

      const order = [
        [sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"],
      ];
      const borrowDetails =
        await borrowDetailRepository.findBorrowDetailsPaginatedWithBook(
          {
            where: {},
            offset,
            limit,
            order,
          },
          {
            bookWhere: where,
          }
        );
      return borrowDetails;
    } catch (error) {
      throw error;
    }
  }
  static async getAllBorrowDetailById(ids, options = {}) {
    return borrowDetailRepository.findBorrowDetails(
      {
        id: {
          [Op.in]: ids,
        },
      },
      options
    );
  }
  static async updateBorrowDetailStatusByIds(ids, data, options = {}) {
    return borrowDetailRepository.updateBorrowDetail(
      {
        id: {
          [Op.in]: ids,
        },
      },
      data,
      {
        fields: ["status"],
        ...options,
      }
    );
  }
  static async getBorrowDetailById(id, options = {}) {
    try {
      return await borrowDetailRepository.findBorrowDetail({ id }, options);
    } catch (error) {
      throw error;
    }
  }
  static async markAsReturnedById(id, options = {}) {
    try {
      const [updatedRow] = await borrowDetailRepository.updateBorrowDetail(
        { id },
        { status: "RETURNED" },
        {
          fields: ["status"],
          ...options,
        }
      );
      return updatedRow > 0;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = BorrowDetailServices;
