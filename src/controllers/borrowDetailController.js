const { sequelize } = require("../models");
const borrowDetailServices = require("../services/borrowDetailServices");
const bookServices = require("../services/bookServices");
const encodeBase64 = require("../utils/base64");

class BorrowDetailController {
  static async searchBorrowDetails(req, res) {
    const { query } = req;
    try {
      const limit = req.query.limit
        ? req.query.limit > 0
          ? parseInt(req.query.limit)
          : 10
        : 10;

      const { count, rows: borrowDetais } =
        await borrowDetailServices.searchBorrowDetailsWithBookPaginated({
          query,
          limit,
        });
      const totalPages = Math.ceil(count / limit);
      const page = parseInt(req.query.page) || 1;
      return res.status(200).json({
        success: true,
        data: borrowDetais,
        page: page,
        totals: totalPages,
        message: "Lấy danh sách chi tiết phiếu mượn thành công",
      });
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        success: true,
        data: [],
        page: 0,
        totals: 0,
        message: error.message,
      });
    }
  }
  static async markAsReturned(req, res) {
     const { id } = req.params;
     try {
       await sequelize.transaction(async (t) => {
         const borrowDetail = await borrowDetailServices.getBorrowDetailById(
           id
         );
         if (!borrowDetail)
           throw new Error("Chi tiết phiếu mượn không tồn tại");

         const isUpdated = await borrowDetailServices.markAsReturnedById(id, {
           transaction: t,
         });
         const isUpdatedStock = await bookServices.increaseBookStock(
           borrowDetail.book_id,
           1,
           { transaction: t }
         );

         if (!isUpdatedStock)
           throw new Error("Cập nhật số lượng sách thất bại");
         if (!isUpdated)
           throw new Error("Cập nhật trạng thái trả sách thất bại");
       });

       return res.redirect(
         `/borrows/?success=` +
           encodeBase64("Cập nhật trạng thái trả sách thành công")
       );
     } catch (error) {
       console.error(error);
       return res.redirect(
         `/borrows/?error=` +
           encodeBase64(error.message || "Lỗi khi cập nhật trạng thái trả sách")
       );
     }
  }
}

module.exports = BorrowDetailController;
