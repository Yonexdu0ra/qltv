const {
  borrowServices,
  bookServices,
  borrowDetailServices,
} = require("../services/");
const { BORROW_STATUS_CONSTANTS } = require("../utils/constants");
const encodeBase64 = require("../utils/base64");
const { sequelize } = require("../models");

class BorrowController {
  static async renderViewBorrowsReader(req, res) {
    const borrower_id = req.user.user_id;
    const { query } = req;
    const limit = req.query.limit
      ? req.query.limit > 0
        ? parseInt(borrower_id, req.query.limit)
        : 10
      : 10;
    const page = parseInt(req.query.page) || 1;
    try {
      const { count, rows: borrows } =
        await borrowServices.getAllBorrowByBorrowerIdWithBorrowerAndApproverAndBooks(
          borrower_id,
          req.query
        );

      const totalPages = Math.ceil(count / limit);
      return res.render("borrows/index", {
        title: "Mượn trả",
        borrows,
        totals: totalPages,
        page,
        query,
      });
    } catch (error) {
      console.log(error);

      return res.render("borrows/index", {
        title: "Mượn trả",
        error: error.message,
        page,
        totals: 0,
        borrows: [],
        query,
      });
    }
  }
  static async renderViewBorrows(req, res) {
    const borrower_id = req.user.user_id;
    const { query } = req;
    const limit = req.query.limit
      ? req.query.limit > 0
        ? parseInt(borrower_id, req.query.limit)
        : 10
      : 10;
    const page = parseInt(req.query.page) || 1;
    try {
      const { count, rows: borrows } =
        await borrowServices.getAllBorrowWithBorrowerAndApproverAndBooks(
          { ...limit, ...query }
        );
      // console.log(borrows[0].toJSON());

      const totalPages = Math.ceil(count / limit);
      return res.render("borrows/index", {
        title: "Mượn trả",
        borrows,
        totals: totalPages,
        page,
        query,
      });
    } catch (error) {
      console.log(error);

      return res.render("borrows/index", {
        title: "Mượn trả",
        error: error.message,
        page,
        totals: 0,
        borrows: [],
        query,
      });
    }
  }
  static async renderViewCreateBorrow(req, res) {
    const today = new Date();
    return res.render("borrows/add", { title: "Thêm phiếu mượn", borrow: {}, today });
  }
  static async renderViewBorrowDetail(req, res) {
    const { id } = req.params;
    try {
      const borrow =
        await borrowServices.getBorrowByIdWithBorrowerAndApproverAndBooks(id);
        console.log(borrow.toJSON());
        
      if (!borrow) throw new Error("Phiếu mượn không tồn tại");
      return res.render("borrows/detail", {
        title: "Chi tiết phiếu mượn",
        borrow,
      });
    } catch (error) {
      return res.render("borrows/detail", {
        title: "Chi tiết phiếu mượn",
        error: error.message,
        borrow: {},
      });
    }
  }
  static async renderViewEditBorrow(req, res) {
    const { id } = req.params;
    try {
      if (!id) throw new Error("Phiếu mượn không tồn tại không thể sửa");
      const borrow =
        await borrowServices.getBorrowByIdWithBorrowerAndApproverAndBooks(id);
      if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể sửa");
      return res.render("borrows/edit", { title: "Sửa phiếu mượn", borrow });
    } catch (error) {
      return res.redirect("/dashboard/borrows?error=" + encodeBase64(error.message));
    }
  }

  static async handleCreateBorrow(req, res) {
    const borrower_id = req.user.user_id;
    const transaction = await sequelize.transaction();
    try {
      const books = [...req.body.books];
      if (books.length === 0) throw new Error("Vui lòng chọn sách để mượn");
      const bookIdsInt = books.map((id) => parseInt(id));
      // kiểm tra sách có tồn tại không
      const listBooks = await bookServices.getAllBookByIds(bookIdsInt, {
        attributes: ["id", "title", "quantity_available"],
      });
      // danh sách sách không có sẵn
      const listBooksUnavailable = listBooks.filter(
        (b) => b.quantity_available <= 0
      );
      if (listBooksUnavailable.length > 0) {
        const titles = listBooksUnavailable.map((b) => b.title).join(", ");
        throw new Error(`Các sách sau không có sẵn để mượn: ${titles}`);
      }

      // so sánh số lượng sách được tìm thấy và số lượng sách yêu cầu mượn
      if (listBooks.length !== bookIdsInt.length)
        throw new Error(
          "Một số sách không tồn tại trong hệ thống, vui lòng kiểm tra lại"
        );
      const bookFormat = listBooks.map((b) => b.id);
      // giảm số lượng sách có sẵn của các cuốn sách được mượn
      const isUpdatedStock = await bookServices.decrementBookByIds(
        "quantity_available",
        1,
        bookFormat,
        { transaction }
      );
      if (!isUpdatedStock) throw new Error("Cập nhật số lượng sách thất bại");
      // tạo phiếu mượn
      const data = await borrowServices.createBorrow(
        {
          ...req.body,
          borrower_id,
          books: bookFormat,
        },
        {
          transaction,
          attributes: ["id"],
          fields: ["borrower_id", "status", "borrow_date", "due_date"],
        }
      );
      const dataBulk = bookFormat.map((book_id) => ({
        borrow_id: data.id,
        book_id,
        status: BORROW_STATUS_CONSTANTS.REQUESTED,
      }));
      await borrowDetailServices.createBorrowDetailsBulk(dataBulk, {
        transaction,
      });
      await transaction.commit();
      return res.redirect(
        "/dashboard/borrows?success=" + encodeBase64("Thêm phiếu mượn thành công")
      );
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return res.render("borrows/add", {
        title: "Thêm phiếu mượn",
        error: error.message,
        borrow: req.body,
      });
    }
  }

  // đánh dấu từ chối không cho mượn
  static async handlerMarkAsRejected(req, res) {
    const { id } = req.params;
    // const transaction = await sequelize.transaction();
    try {
      await sequelize.transaction(async (t) => {
        if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
        const borrow = await borrowServices.getBorrowByIdWithBorrowDetails(id, {
          attributes: ["id", "status"],
          borrowDetailAttributes: ["id", "book_id", "borrow_id"],
        });
        if (!borrow)
          throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
        if (borrow.status !== BORROW_STATUS_CONSTANTS.REQUESTED)
          throw new Error(
            "chỉ có thể cập nhật phiếu mượn ở trạng thái đang yêu cầu mượn"
          );
        // ấn reject thì trả lại số lượng sách đã giữ
        const isUpdatedStock = await bookServices.incrementBookByIds(
          "quantity_available",
          1,
          borrow.borrowDetails.map((b) => b.book_id),
          { transaction: t }
        );
        if (!isUpdatedStock) throw new Error("Cập nhật số lượng sách thất bại");
        const isUpdated = await borrowServices.markAsRejectedBorrowById(
          borrow.id,
          {
            transaction: t
          }
        );
        // đánh dấu từ chối trạng thái các sách trong chi tiết phiếu mượn
        const borrowDetailIds = borrow.borrowDetails.map((bd) => bd.id);
        const isUpdateBorrowDetail = await borrowDetailServices.markAsRejectedBorrowDetailByIds(
          borrowDetailIds,
          {
            transaction: t
          }
        );
        if (!isUpdateBorrowDetail) throw new Error("Cập nhật chi tiết phiếu mượn thất bại");
        if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
      });
      return res.redirect(
        "/dashboard/borrows?success=" + encodeBase64("Cập nhật phiếu mượn thành công")
      );
    } catch (error) {
      console.log(error);
    
      return res.redirect("/dashboard/borrows?error=" + encodeBase64(error.message));
    }
  }
  // đánh dấu hủy phiếu mượn
  static async handlerMarkAsCancel(req, res) {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
      if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
      const borrow = await borrowServices.getBorrowByIdWithBorrowDetails(id, {
        attributes: ["id", "status"],
        borrowDetailAttributes: ["id", "book_id", "borrow_id"],
      });
      if (!borrow)
        throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
      if (borrow.status !== BORROW_STATUS_CONSTANTS.REQUESTED)
        throw new Error(
          "chỉ có thể cập nhật phiếu mượn ở trạng thái đang yêu cầu mượn"
        );

      const isUpdated = await borrowServices.markAsCancelledBorrowById(
        borrow.id,
        { transaction }
      );
      if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
      // ấn hủy thì trả lại số lượng sách đã giữ
      const isUpdatedStock = await bookServices.incrementBookByIds(
        "quantity_available",
        1,
        borrow.borrowDetails.map((b) => b.book_id),
        { transaction }
      );
      if (!isUpdatedStock) throw new Error("Cập nhật số lượng sách thất bại");
      // đánh dấu hủy trạng thái các sách trong chi tiết phiếu mượn
      const borrowDetailIds = borrow.borrowDetails.map((bd) => bd.id);
      const isUpdateBorrowDetail = await borrowDetailServices.markAsCancelledBorrowDetailByIds(
        borrowDetailIds,
        { transaction }
      );  
      if (!isUpdateBorrowDetail) throw new Error("Cập nhật chi tiết phiếu mượn thất bại");
      await transaction.commit();

      return res.redirect(
        "/dashboard/borrows?success=" + encodeBase64("Cập nhật phiếu mượn thành công")
      );
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return res.redirect("/dashboard/borrows?error=" + encodeBase64(error.message));
    }
  }
  // đánh dấu đã duyệt, chờ lấy sách
  static async handlerMarkAsApproved(req, res) {
    const { id } = req.params;
    const approver_id = req.user.user_id;
    const transaction = await sequelize.transaction();
    try {
      if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
      const borrow = await borrowServices.getBorrowByIdWithBorrowDetails(id, {
        attributes: ["id", "status"],
        borrowDetailAttributes: ["id", "book_id", "borrow_id"],
      });
      if (!borrow)
        throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
      if (borrow.status !== BORROW_STATUS_CONSTANTS.REQUESTED)
        throw new Error(
          "chỉ có thể cập nhật phiếu mượn ở trạng thái Đã duyệt, chờ lấy"
        );
      const isUpdated = await borrowServices.markAsApprovedBorrowById(
        borrow.id,
        approver_id, {
        transaction
      }
      );
      if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
      const borrowDetailIds = borrow.borrowDetails.map((bd) => bd.id);
      const isUpdateBorrowDetail = await borrowDetailServices.markAsApprovedBorrowDetailByIds(
        borrowDetailIds, {
        transaction
      }
      );
      if (!isUpdateBorrowDetail) throw new Error("Cập nhật chi tiết phiếu mượn thất bại");
      await transaction.commit();
      return res.redirect(
        "/dashboard/borrows?success=" + encodeBase64("Cập nhật phiếu mượn thành công")
      );
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return res.redirect("/dashboard/borrows?error=" + encodeBase64(error.message));
    }
  }
  // đánh dấu quá hạn
  static async handlerMarkAsExpired(req, res) {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
      if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
      const borrow = await borrowServices.getBorrowByIdWithBorrowDetails(id, {
        attributes: ["id", "status"],
        borrowDetailAttributes: ["id", "book_id", "borrow_id"],
      });
      if (!borrow)
        throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
      if (borrow.status !== BORROW_STATUS_CONSTANTS.BORROWED)
        throw new Error(
          "chỉ có thể cập nhật phiếu mượn ở trạng thái Đang mượn"
        );
      const isUpdated = await borrowServices.markAsExpiredBorrowById(borrow.id, { transaction });
      if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
      const borrowDetailIds = borrow.borrowDetails.map((bd) => bd.id);
      const isUpdateBorrowDetail = await borrowDetailServices.markAsExpiredBorrowDetailByIds(
        borrowDetailIds,
        { transaction }
      );
      if (!isUpdateBorrowDetail) throw new Error("Cập nhật chi tiết phiếu mượn thất bại");
      await transaction.commit();
      return res.redirect(
        "/dashboard/borrows?success=" + encodeBase64("Cập nhật phiếu mượn thành công")
      );
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return res.redirect("/dashboard/borrows?error=" + encodeBase64(error.message));
    }
  }
  // đánh dấu đã trả sách
  static async handlerMarkAsReturned(req, res) {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
      if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
      const borrow = await borrowServices.getBorrowByIdWithBorrowDetails(id, {
        attributes: ["id", "status"],
        borrowDetailAttributes: ["id", "book_id", "borrow_id"],
      });
      if (!borrow)
        throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
      if (
        borrow.status !== BORROW_STATUS_CONSTANTS.BORROWED &&
        borrow.status !== BORROW_STATUS_CONSTANTS.EXPIRED
      )
        throw new Error(
          "chỉ có thể cập nhật phiếu mượn ở trạng thái Đang mượn hoặc Quá hạn"
        );
      const isUpdated = await borrowServices.markAsReturnedBorrowById(borrow.id, { transaction });
      if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
      const isUpdatedStock = await bookServices.incrementBookByIds(
        "quantity_available",
        1,
        borrow.borrowDetails.map((b) => b.book_id),
        { transaction }
      );
      if (!isUpdatedStock) throw new Error("Cập nhật số lượng sách thất bại");
      const borrowDetailIds = borrow.borrowDetails.map((bd) => bd.id);
      await borrowDetailServices.markAsReturnedBorrowDetailByIds(borrowDetailIds, {
        transaction,
      });
      await transaction.commit();
      return res.redirect('/dashboard/borrows?success=' + encodeBase64('Cập nhật phiếu mượn thành công'));
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return res.redirect("/dashboard/borrows?error=" + encodeBase64(error.message));
    }
  }
  // đánh dấu hủy phiếu mượn
  static async handlerMarkAsCanceled(req, res) {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
      if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
      const borrow = await borrowServices.getBorrowByIdWithBorrowDetails(id);
      if (!borrow)
        throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
      if (borrow.status !== BORROW_STATUS_CONSTANTS.BORROWED)
        throw new Error(
          "chỉ có thể cập nhật phiếu mượn ở trạng thái Đang mượn"
        );
      const isUpdated = await borrowServices.markAsCancelledBorrowById(borrow.id);
      if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
      const borrowDetailIds = borrow.borrowDetails.map((bd) => bd.id);
      const isUpdateBorrowDetail = await borrowDetailServices.markAsCancelledBorrowDetailByIds(
        borrowDetailIds, {
        transaction,
      }
      );
      if (!isUpdateBorrowDetail) throw new Error("Cập nhật chi tiết phiếu mượn thất bại");
      const isUpdatedStock = await bookServices.incrementBookByIds(
        "quantity_available",
        1,
        borrow.borrowDetails.map((b) => b.book_id),
        { transaction }
      );
      if (!isUpdatedStock) throw new Error("Cập nhật số lượng sách thất bại");
      await transaction.commit();
      return res.redirect(
        "/dashboard/borrows?success=" + encodeBase64("Cập nhật phiếu mượn thành công")
      );
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return res.redirect("/dashboard/borrows?error=" + encodeBase64(error.message));
    }
  }
  // đánh dấu đã lấy sách
  static async handlerMarkAsBorrowed(req, res) {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
      if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
      const borrow = await borrowServices.getBorrowByIdWithBorrowDetails(id, {
        attributes: ["id", "status"],
        borrowDetailAttributes: ["id", "book_id", "borrow_id"],
      });
      if (!borrow)
        throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
      if (borrow.status !== BORROW_STATUS_CONSTANTS.APPROVED)
        throw new Error(
          "chỉ có thể cập nhật phiếu mượn ở trạng thái Đã phê duyệt, chờ lấy"
        );
      const isUpdated = await borrowServices.markAsBorrowedBorrowById(borrow.id, { transaction });
      if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
      const borrowDetailIds = borrow.borrowDetails.map((bd) => bd.id);
      const isUpdateBorrowDetail = await borrowDetailServices.markAsBorrowedBorrowDetailByIds(borrowDetailIds, {
        transaction,
      });
      if (!isUpdateBorrowDetail) throw new Error("Cập nhật chi tiết phiếu mượn thất bại");
      await transaction.commit();
      return res.redirect(
        "/dashboard/borrows?success=" + encodeBase64("Cập nhật phiếu mượn thành công")
      );
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      return res.redirect("/dashboard/borrows?error=" + encodeBase64(error.message));
    }
  }
}

module.exports = BorrowController;
