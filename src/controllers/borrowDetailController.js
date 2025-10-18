const borrowDetailServices = require("../services/borrowDetailServices");

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
      return res.status(200).json({
        success: true,
        data: borrowDetais,
        page: 0,
        totals: 0,
        message: error.message,
      });
    }
  }
}

module.exports = BorrowDetailController;
