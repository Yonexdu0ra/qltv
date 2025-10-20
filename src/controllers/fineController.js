const fineServices = require("../services/fineServices");
const borrowDetailServices = require("../services/borrowDetailServices");
const encodeBase64 = require("../utils/base64");
const { sequelize } = require("../models");
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
        await fineServices.getAllFinesWithBorrowDetailAndBorrowerAndBookPagination({ limit, query }, {
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
      });
    }
  }
  static async renderViewFinesByReader(req, res, next) {
    const { user_id } = req.user;
    try {
      // const fines = await fineServices.getAllFines();
      // return res.render('fines/index', { title: "Quản lý phí", fines });
    } catch (error) {
      return next(error);
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
  static renderViewEditFine(req, res, next) {
    try {
      return res.render("fines/edit", { title: "Chỉnh sửa phí", fine: {} });
    } catch (error) {
      return next(error);
    }
  }

  static async handlerCreateFine(req, res, next) {
    const { user_id } = req.user;
    const transaction = await sequelize.transaction();
    try {
      const borrowDetailIds = [...(req.body.borrow_detail_ids || [])];

      const borrowDetailIdsInt = borrowDetailIds.map((id) => parseInt(id));
      const amount = parseFloat(req.body.amount);
      const status = req.body.status;
      const totalBorrowDetailsHasInDB =
        await borrowDetailServices.getAllBorrowDetailsByIds(borrowDetailIdsInt, { attributes: ["id", 'borrow_id', 'status', 'book_id'] });

      if (totalBorrowDetailsHasInDB.length !== borrowDetailIds.length) {
        throw new Error("Một số chi tiết mượn không tồn tại trong hệ thống");
      }

      const note = req.body.note;
      const listFine = borrowDetailIdsInt.map((borrowDetailId) => ({
        borrow_detail_id: borrowDetailId,
        amount,
        note,
      }));
      const isUpdateBorrowDetail =
        await borrowDetailServices.updateBorrowDetailByIds(
          borrowDetailIdsInt,
          { status },
          { transaction, fields: ["status"] }
        );
        console.log(isUpdateBorrowDetail);
        
        if(!isUpdateBorrowDetail) {
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

  static async handlerEditFine(req, res, next) {}
  static async handlerMarkAsPaidFine(req, res) {
    const { id } = req.params;
    try {
      const fine = await fineServices.getFineById(id);
      if (!fine)
        return res.redirect(
          "/dashboard/fines?error=" + encodeBase64("Phí không tồn tại")
        );
      const isUpdated = await fineServices.markAsPaidFineById(id, { fields: ['is_paid'] });
      if (!isUpdated) throw new Error("Cập nhật trạng thái phí thất bại");
      return res.redirect(
        "/dashboard/fines?success=" +
          encodeBase64("Đánh dấu phí đã thanh toán thành công")
      );
    } catch (error) {
      return res.redirect("/dashboard/fines?error=" + encodeBase64(error.message));
    }
  }
}

module.exports = FineController;
