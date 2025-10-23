const fineServices = require("../services/fineServices");
const borrowDetailServices = require("../services/borrowDetailServices");
const encodeBase64 = require("../utils/base64");
const { sequelize } = require("../models");
const formatVND = require("../utils/formatVND");
class FineController {
  static async renderViewFines(req, res, next) {
    const { query } = req;
    const limit = req.query.limit
      ? req.query.limit > 0
        ? parseInt(req.query.limit)
        : 10
      : 10;
    const page = parseInt(req.query.page) || 1;
    try {
      const { rows: fines, count } =
        await fineServices.getAllFinesWithBorrowDetailAndBorrowerAndBookPagination({ limit, ...query }, {
          attributes: ["id", "amount", "is_paid", "note", "created_at"],
          bookAttributes: ["title"],
          borrowDetailAttributes: ["id", "borrow_id", "status"],
          borrowAttributes: ["id", "due_date"],
        });

      const totalPages = Math.ceil(count / limit);
      return res.render("fines/index", {
        title: "Quản lý phạt",
        fines,
        totals: totalPages,
        page,
        query,
        formatVND,
      });
    } catch (error) {
      console.log(error.message);
      return res.render("fines/index", {
        title: "Quản lý phạt",
        fines: [],
        totals: 0,
        page,
        query,
        error: error.message,
        formatVND,
      });
    }
  }


  static async renderViewFineDetail(req, res, next) {
    const { id } = req.params;
    try {
      const fine = await fineServices.getFineByIdWithBorrowDetailAndBorrowerAndBook(id);
      if (!fine) throw new Error("Phí không tồn tại");
      return res.render("fines/detail", { title: "Chi tiết phí", fine });
    } catch (error) {
      return res.redirect("/dashboard/fines?error=" + encodeBase64(error.message));
    }
  }

  static async renderViewCreateFine(req, res, next) {
    try {
      return res.render("fines/add", { title: "Thêm phí", fine: {} });
    } catch (error) {
      return next(error);
    }
  }
  static async renderViewEditFine(req, res, next) {

    const { id } = req.params;
    try {
      const fine = await fineServices.getFineById(id, { attributes: ["id", "amount", "is_paid", "note", "created_at"] });
      return res.render("fines/edit", { title: "Chỉnh sửa phí", fine });
    } catch (error) {
      return res.redirect('/not-found/fines?error=' + encodeBase64(error.message));
    }
  }

  static async handlerCreateFine(req, res, next) {
    const { user_id } = req.user;
    const transaction = await sequelize.transaction();
    try {

      const borrowDetailIds = [...Array.isArray(req.body.borrow_detail_ids) ? req.body.borrow_detail_ids : [req.body.borrow_detail_ids]].filter(id => id);

      const borrowDetailIdsInt = borrowDetailIds.map((id) => parseInt(id));
      const amount = parseFloat(req.body.amount);
      const status = req.body.status;
      const totalBorrowDetailsHasInDB =
        await borrowDetailServices.getAllBorrowDetailsByIds(borrowDetailIdsInt, { attributes: ["id", 'borrow_id', 'status', 'book_id'] });

      if (totalBorrowDetailsHasInDB.length !== borrowDetailIds.length) {
        throw new Error("Một số chi tiết mượn không tồn tại trong hệ thống");
      }

      const note = req.body.note;
      const listFine = totalBorrowDetailsHasInDB.map((borrowDetail) => ({
        borrow_detail_id: borrowDetail.id,
        amount,
        note,
      }));


      const isUpdateBorrowDetail =
        await borrowDetailServices.updateBorrowDetailByIds(
          { status },
          borrowDetailIdsInt,
          { transaction, fields: ["status"] }
        );
      if (!isUpdateBorrowDetail) {
        throw new Error("Cập nhật trạng thái chi tiết mượn thất bại");
      }
      const fines = await fineServices.createFines(listFine, { transaction });
      await transaction.commit();

      return res.redirect(
        "/dashboard/fines?success=" + encodeBase64("Tạo phí thành công")
      );
    } catch (error) {
      console.log(error);

      await transaction.rollback();
      return res.redirect("/dashboard/fines?error=" + encodeBase64(error.message));
    }
  }
  static async renderViewDetailFine(req, res, next) {
    const { id } = req.params;
    try {
      const fine = await fineServices.getFineByIdWithBorrowDetailAndBorrowerAndBook(id, {
        attributes: ["id", "amount", "is_paid", "note", "created_at"],
        bookAttributes: ["title"],
        borrowDetailAttributes: ["id", "borrow_id", "status"],
        borrowAttributes: ["id", "due_date"],
      });
      if (!fine) throw new Error("Phí không tồn tại");
      return res.render("fines/detail", { title: "Chi tiết phí", fine, formatVND });
    } catch (error) {
      return res.redirect("/not-found/fines?error=" + encodeBase64(error.message));
    }
  }
  static async handlerEditFine(req, res) {
    const { id } = req.params;
    try {
      
      const fine = await fineServices.getFineById(id, { attributes: ['id'] });
      if (!fine) throw new Error("Phí không tồn tại");
      const amount = Number(req.body.amount);
      const note = req.body.note;
      const is_paid = Boolean(req.body.is_paid)
      if(isNaN(amount) || amount < 0) {
        throw new Error("Số tiền không hợp lệ");
      }
      const isUpdated = await fineServices.updateFineById( { amount, note, is_paid }, id, { fields: ['amount', 'note', 'is_paid'] });
      if (!isUpdated) throw new Error("Cập nhật phí thất bại");
      return res.redirect(
        "/dashboard/fines?success=" +
        encodeBase64("Cập nhật phí thành công")
      );
    } catch (error) {
      return res.redirect("/dashboard/fines?error=" + encodeBase64(error.message));
    }
  }
  static async handlerMarkAsPaidFine(req, res) {
    const { id } = req.params;
    try {
      const fine = await fineServices.getFineById(id, { attributes: ['id'] });
      if (!fine)
        return res.redirect(
          "/dashboard/fines?error=" + encodeBase64("Phí không tồn tại")
        );
      const isUpdated = await fineServices.markAsPaidFineById(fine.id, { fields: ['is_paid'] });
      if (!isUpdated) throw new Error("Cập nhật trạng thái phí thất bại");
      return res.redirect(
        "/dashboard/fines?success=" +
        encodeBase64("Đánh dấu phí đã thanh toán thành công")
      );
    } catch (error) {
      return res.redirect("/dashboard/fines?error=" + encodeBase64(error.message));
    }
  }
  static async renderViewFineForReader(req, res, next) {
    const { user_id } = req.user;
    const { query } = req;
    const limit = req.query.limit
      ? req.query.limit > 0
        ? parseInt(req.query.limit)
        : 10
      : 10;
    const page = parseInt(req.query.page) || 1;
    try {
      const { rows: fines, count } =
        await fineServices.getAllFinesByIdWithBorrowDetailAndBorrowerAndBookPagination(user_id, { limit, ...query }, {
          attributes: ["id", "amount", "is_paid", "note", "created_at"],
          bookAttributes: ["title"],
          borrowDetailAttributes: ["id", "borrow_id", "status"],
          borrowAttributes: ["id", "due_date", "borrower_id"],
        });
      // console.log(fines);

      const totalPages = Math.ceil(count / limit);
      return res.render("fines/list", {
        title: "Quản lý phạt",
        fines,
        totals: totalPages,
        page,
        query,
        formatVND,
      });
    } catch (error) {
      console.log(error.message);
      return res.render("fines/list", {
        title: "Quản lý phạt",
        fines: [],
        totals: 0,
        page,
        query,
        error: error.message,
        formatVND,
      });
    }
  }
}

module.exports = FineController;
