const { sequelize } = require("../models");
const borrowDetailServices = require("../services/borrowDetailServices");
const bookServices = require("../services/bookServices");
const encodeBase64 = require("../utils/base64");
const { BORROW_STATUS_CONSTANTS } = require("../utils/constants");

class BorrowDetailController {
  static async handleSearchBorrowDetailBooks(req, res) {
    const { query } = req;
    const { id } = req.params;
    const limit = req.query.limit
      ? req.query.limit > 0
        ? parseInt(req.query.limit)
        : 10
      : 10;
    const borrowWhere = {}
    if (id) {
      borrowWhere.id = id;
    }
    const page = parseInt(req.query.page) || 1;
    try {
      const { count, rows: borrowDetais } =
        await borrowDetailServices.getBorrowDetailWithBooksPagination({
          ...query,
          limit,
        }, { attributes: ['id', 'borrow_id', 'status'], bookAttributes: ['title'], borrowAttributes: [], page, limit, borrowWhere });
      const totalPages = Math.ceil(count / limit);
      return res.status(200).json({
        success: true,
        data: borrowDetais,
        page,
        totals: count,
        message: "Lấy danh sách chi tiết phiếu mượn thành công",
      });
    } catch (error) {
      return res.status(200).json({
        success: true,
        data: [],
        page,
        totals: 0,
        message: error.message,
      });
    }
  }
  static async markAsReturned(req, res) {
    const { id } = req.params;
    try {
      await sequelize.transaction(async (t) => {
        const borrowDetail = await borrowDetailServices.getBorrowDetailByIdFine(id, { attributes: ['id', 'status', 'book_id'], fineAttributes: ['id', 'is_paid'],  });
        if (!borrowDetail) throw new Error("Chi tiết phiếu mượn không tồn tại");
        
        if(borrowDetail.fine && !borrowDetail.fine.is_paid) {
          throw new Error("Không thể trả sách khi còn phí phạt chưa thanh toán");
        }
        const statusAllowReturn = [BORROW_STATUS_CONSTANTS.BORROWED, BORROW_STATUS_CONSTANTS.OVERDUE, BORROW_STATUS_CONSTANTS.LOSTED, BORROW_STATUS_CONSTANTS.DAMAGED, BORROW_STATUS_CONSTANTS.EXPIRED].includes(borrowDetail.status);
        if (borrowDetail.status === BORROW_STATUS_CONSTANTS.RETURNED) throw new Error("Sách đã được trả trước đó");
        if(!statusAllowReturn) throw new Error("Trạng thái phiếu mượn không hợp lệ để đánh dấu đã trả sách");
        const isUpdated =
          await borrowDetailServices.markAsReturnedBorrowDetailById(
            borrowDetail.id,
            {
              transaction: t,
              fields: ["status"],
            }
          );
        const isUpdatedStock = await bookServices.incrementBookById(
          'quantity_available',
          1,
          borrowDetail.book_id,
          { transaction: t }
        );

        if (!isUpdatedStock) throw new Error("Cập nhật số lượng sách thất bại");
        if (!isUpdated)
          throw new Error("Cập nhật trạng thái trả sách thất bại");
      });

      return res.redirect(
        `/dashboard/borrows/?success=` +
        encodeBase64("Cập nhật trạng thái trả sách thành công")
      );
    } catch (error) {
      console.error(error);
      return res.redirect(
        `/dashboard/borrows/?error=` +
        encodeBase64(error.message || "Lỗi khi cập nhật trạng thái trả sách")
      );
    }
  }
  static async markAsReturnForPaidFine(req, res) {
    
  }
}

module.exports = BorrowDetailController;
