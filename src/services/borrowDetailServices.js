const { Op, where } = require("sequelize");
const { borrowDetailRepository } = require("../repositories");
const { Fine } = require("../models");

class BorrowDetailServices {
  static async createBorrowDetail(data, options = {}) {
    const borrowDetail = await borrowDetailRepository.create(data, {
      ...options,
    });
    return borrowDetail;
  }
  static async getAllBorrowDetailsByIds(ids, options = {}) {
    return borrowDetailRepository.findAll({ id: { [Op.in]: ids } }, options);
  }
  static async getBorrowDetailWithBooksPagination(query, options = {}) {

    const where = {
    };
    const whereBook = {};
    const borrowWhere = {};
    if (query.q) {
      whereBook.title = {
        [Op.like]: `%${query.q || ""}%`,
      };
    }
    if (query.b) {
      borrowWhere.id = query.b;
    }
    if (query.bd) {
      where.id = {
        [Op.in]: query.bd
          .split(",")
          .filter((item) => item)
          .map((item) => parseInt(item)),
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
      : ["updated_at", "DESC"];
    const order = [
      [
        sortBy || "updated_at",
        sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ],
    ];
    if (
      ["BORROWED", "LOSTED", "DAMAGED", "RETURNED"].includes(sortBy) &&
      sortOrder
    ) {
      where.status = { [Op.eq]: sortBy };
      order[0] = [
        "created_at",
        sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ];
    }

    return borrowDetailRepository.findAllWithBorrowAndBookPanigation(where, {
      whereBook,
      limit,
      offset,
      order,
      ...options,
      borrowWhere,
    });
  }
  static async getBorrowDetailById(id, options = {}) {
    return borrowDetailRepository.findByPk(id, { ...options });
  }
  static async getBorrowDetailByIdFine(id, options = {}) {
    return borrowDetailRepository.findOneWithFine({ id }, {
      ...options,
    });
  }
  static async getBorrowDetailByIdWithBooks(id, options = {}) {
    return borrowDetailRepository.findOneWithBorrowAndBook(
      { id },
      { ...options }
    );
  }
  static async updateBorrowDetailById(data, id, options = {}) {
    return borrowDetailRepository.update(data, { id }, options);
  }
  static async updateBorrowDetailByIds(data, ids, options = {}) {
    await borrowDetailRepository.update(
      data,
      { id: { [Op.in]: ids } },
      options
    );
    return true;
  }
  static async markAsReturnedBorrowDetailByIds(ids, options = {}) {
    const [updatedRow] = await borrowDetailRepository.update(
      { status: "RETURNED" },
      { id: { [Op.in]: ids } },
      {
        fields: ["status"],
        ...options,
      }
    );

    return updatedRow > 0;
  }

  static async markAsReturnedBorrowDetailById(id, options = {}) {
    const [updatedRow] = await borrowDetailRepository.update(
      { status: "RETURNED" },
      { id },
      {

        ...options,
      }
    );
    return updatedRow > 0;
  }
  static async markAsReturnBorrowDetailByBorrowedId(borrowId, options = {}) {
    const [updatedRow] = await borrowDetailRepository.update(
      { status: "RETURNED" },
      { borrow_id: borrowId },
      {
        fields: ["status"],
        ...options,
      }
    );
    return updatedRow > 0;
  }
  static async markAsReturnBorrowDetailByBorrowedId(borrowId, options = {}) {
    const [updatedRow] = await borrowDetailRepository.update(
      { status: "RETURNED" },
      { borrow_id: borrowId },
      {
        fields: ["status"],
        ...options,
      }
    );
    return updatedRow > 0;
  }
  static async deleteBorrowDetailById(id, options = {}) {
    return borrowDetailRepository.delete({ id }, options);
  }
  static async deleteBorrowDetailByBorrowId(borrowId, options = {}) {
    return borrowDetailRepository.delete({ borrow_id: borrowId }, options);
  }
  static async deleteBorrowDetailByIds(ids, options = {}) {
    return borrowDetailRepository.delete({ id: { [Op.in]: ids } }, options);
  }
  static async createBorrowDetailsBulk(dataArray, options = {}) {
    return borrowDetailRepository.bulkCreate(dataArray, {
      ...options,
    });
  }
  static async markAsRejectedBorrowDetailByIds(ids, options = {}) {
    const [updatedRow] = await borrowDetailRepository.update(
      { status: "REJECTED" },
      { id: { [Op.in]: ids } },
      {
        fields: ["status"],
        ...options,
      }
    );
    return updatedRow > 0;
  }
  static async markAsApprovedBorrowDetailByIds(ids, options = {}) {
    const [updatedRow] = await borrowDetailRepository.update(
      { status: "APPROVED" },
      { id: { [Op.in]: ids } },
      {
        fields: ["status"],
        ...options,
      }
    );
    return updatedRow > 0;
  }
  static async markAsLostedBorrowDetailByIds(ids, options = {}) {
    const [updatedRow] = await borrowDetailRepository.update(
      { status: "LOSTED" },
      { id: { [Op.in]: ids } },
      {
        fields: ["status"],
        ...options,
      }
    );
    return updatedRow > 0;
  }
  static async markAsDamagedBorrowDetailByIds(ids, options = {}) {
    const [updatedRow] = await borrowDetailRepository.update(
      { status: "DAMAGED" },
      { id: { [Op.in]: ids } },
      {
        fields: ["status"],
        ...options,
      }
    );
    return updatedRow > 0;
  }
  static markAsCancelledBorrowDetailByIds(ids, options = {}) {
    return borrowDetailRepository.update(
      { status: "CANCELLED" },
      { id: { [Op.in]: ids } },
      {
        fields: ["status"],
        ...options,
      }
    );
  }
  static async markAsExpiredBorrowDetailByIds(ids, options = {}) {
    const [updatedRow] = await borrowDetailRepository.update(
      { status: "EXPIRED" },
      { id: { [Op.in]: ids } },
      {
        fields: ["status"],
        ...options,
      }
    );
    return updatedRow > 0;
  }
  static async markAsBorrowedBorrowDetailByIds(ids, options = {}) {
    const [updatedRow] = await borrowDetailRepository.update(
      { status: "BORROWED" },
      { id: { [Op.in]: ids } },
      {
        fields: ["status"],
        ...options,
      }
    );
    return updatedRow > 0;
  }
}
module.exports = BorrowDetailServices;
