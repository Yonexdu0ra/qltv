const borrowServices = require("../services/borrowServices");
const { BORROW_STATUS_CONSTANTS } = require("../utils/constants");


class BorrowController {

    static async renderViewBorrowsReader(req, res) {
        const borrower_id = req.user.user_id;
        try {
            const limit = req.query.limit ? req.query.limit > 0 ? parseInt(borrower_id, req.query.limit) : 10 : 10
            const { count, rows: borrows } = await borrowServices.findBorrowPaginationWithUserId(borrower_id, req.query);
            const totalPages = Math.ceil(count / limit);
            const page = parseInt(req.query.page) || 1;
            return res.render('borrows/index', { title: "Mượn trả", borrows, totals: totalPages, page ,query: req.query});
        } catch (error) {
            return res.render('borrows/index', { title: "Mượn trả", error: error.message, page: 1, totals: 0, borrows: [], query: req.query  });
        }
    }
    static async renderViewBorrows(req, res) {
        try {
            const limit = req.query.limit ? req.query.limit > 0 ? parseInt(req.query.limit) : 10 : 10
            const { count, rows: borrows } = await borrowServices.findBorrowPagination(req.query);
            const totalPages = Math.ceil(count / limit);
            const page = parseInt(req.query.page) || 1;
            return res.render('borrows/index', { title: "Quản lý mượn trả", borrows, totals: totalPages, page ,query: req.query});
        } catch (error) {
            return res.render('borrows/index', { title: "Quản lý mượn trả", error: error.message, page: 1, totals: 0, borrows: [], query: req.query  });
        }
    }
    static async renderViewCreateBorrow(req, res) {
        return res.render('borrows/add', { title: "Thêm phiếu mượn", borrow: {} });
    }

    static async renderViewEditBorrow(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể sửa");
            const borrow = await borrowServices.getBorrowByIdWithBooks(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể sửa");
            return res.render('borrows/edit', { title: "Sửa phiếu mượn", borrow });
        } catch (error) {
            return res.redirect('/borrows?error=' + encodeBase64(error.message))
        }
    }


    static async handleCreateBorrow(req, res) {
        const borrower_id = req.user.user_id;
        try {
            if(!data.body.books || !Array.isArray(data.body.books) || data.body.books.length === 0) {
                throw new Error("Vui lòng chọn sách muốn mượn");
            }
            const data = await borrowServices.createBorrow({
                ...req.body,
                borrower_id
            });
            return res.redirect('/borrows?success=' + encodeBase64("Thêm phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.render("borrows/add", { title: "Thêm phiếu mượn", error: error.message, borrow: req.body });
        }
    }
    static async handleEditBorrow(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể sửa");
            const borrow = await borrowServices.getBorrowById(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể sửa");
            await borrowServices.updateBorrow(borrow.id, req.body);
            return res.redirect('/borrows?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        }
        catch (error) {
            console.log(error);
            return res.render("borrows/edit", { title: "Sửa phiếu mượn", error: error.message, borrow: { id, ...req.body } });
        }
    }

    // đánh dấu từ chối không cho mượn
    static async handlerMarkAsRejected(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            const borrow = await borrowServices.getBorrowById(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            if(borrow.status !== "REQUESTED") throw new Error("chỉ có thể cập nhật phiếu mượn ở trạng thái đang yêu cầu mượn");
            const isUpdated = await borrowServices.markAsRejected(borrow.id);
            if(!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
            return res.redirect('/borrows?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.redirect('/borrows?error=' + encodeBase64(error.message))
        }
    }
    // đánh dấu hủy phiếu mượn
    static async handlerMarkAsCancel(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            const borrow = await borrowServices.getBorrowById(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            if(borrow.status !== "REQUESTED") throw new Error("chỉ có thể cập nhật phiếu mượn ở trạng thái đang yêu cầu mượn");
            const isUpdated = await borrowServices.markAsCancel(borrow.id);
            if(!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
            return res.redirect('/borrows?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.redirect('/borrows?error=' + encodeBase64(error.message))
        }
    }
    // đánh dấu đã duyệt, chờ lấy sách
    static async handlerMarkAsApproved(req, res) {
        const { id } = req.params;
        const approver_id = req.user.user_id;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            const borrow = await borrowServices.getBorrowById(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            if(borrow.status !== BORROW_STATUS_CONSTANTS.REQUESTED) throw new Error("chỉ có thể cập nhật phiếu mượn ở trạng thái Đã duyệt, chờ lấy");
            const isUpdated = await borrowServices.markAsApproved(borrow.id, approver_id);
            if(!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
            return res.redirect('/borrows?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.redirect('/borrows?error=' + encodeBase64(error.message))
        }
    }
    // đánh dấu quá hạn
    static async handlerMarkAsExpired(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            const borrow = await borrowServices.getBorrowById(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            if(borrow.status !== BORROW_STATUS_CONSTANTS.BORROWED) throw new Error("chỉ có thể cập nhật phiếu mượn ở trạng thái Đang mượn");
            const isUpdated = await borrowServices.markAsExpired(borrow.id);
            if(!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
            return res.redirect('/borrows?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.redirect('/borrows?error=' + encodeBase64(error.message))
        }
    }
    // đánh dấu đã trả sách
    static async handlerMarkAsReturned(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            const borrow = await borrowServices.getBorrowById(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            if(borrow.status !== BORROW_STATUS_CONSTANTS.BORROWED && borrow.status !== BORROW_STATUS_CONSTANTS.EXPIRED) throw new Error("chỉ có thể cập nhật phiếu mượn ở trạng thái Đang mượn hoặc Quá hạn");
            const isUpdated = await borrowServices.markAsReturned(borrow.id);
            if(!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
            return res.redirect('/borrows?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.redirect('/borrows?error=' + encodeBase64(error.message))
        }
    }

}


module.exports = BorrowController;