const borrowServices = require("../services/borrowServices");
const bookServices = require("../services/bookServices");
const { BORROW_STATUS_CONSTANTS } = require("../utils/constants");
const encodeBase64 = require("../utils/base64");


class BorrowController {

    static async renderViewBorrowsReader(req, res) {
        const borrower_id = req.user.user_id;
        try {
            const limit = req.query.limit ? req.query.limit > 0 ? parseInt(borrower_id, req.query.limit) : 10 : 10
            const { count, rows: borrows } = await borrowServices.findBorrowPaginationWithBorrowerId(borrower_id, req.query);

            const totalPages = Math.ceil(count / limit);
            const page = parseInt(req.query.page) || 1;
            return res.render('borrows/index', { title: "Mượn trả", borrows, totals: totalPages, page, query: req.query });
        } catch (error) {
            return res.render('borrows/index', { title: "Mượn trả", error: error.message, page: 1, totals: 0, borrows: [], query: req.query });
        }
    }
    static async renderViewBorrows(req, res) {
        const borrower_id = req.user.user_id;

        try {
            
            const limit = req.query.limit ? req.query.limit > 0 ? parseInt(req.query.limit) : 10 : 10
            const { count, rows: borrows } = await borrowServices.findBorrowPaginationWithBorrowerAndBooks(req.query);
            console.log(borrows.map(b => b.toJSON())[0]);


            const totalPages = Math.ceil(count / limit);
            const page = parseInt(req.query.page) || 1;
            return res.render('borrows/index', { title: "Quản lý mượn trả", borrows, totals: totalPages, page, query: req.query });
        } catch (error) {
            return res.render('borrows/index', { title: "Quản lý mượn trả", error: error.message, page: 1, totals: 0, borrows: [], query: req.query });
        }
    }
    static async renderViewCreateBorrow(req, res) {
        return res.render('borrows/add', { title: "Thêm phiếu mượn", borrow: {} });
    }
    static async renderViewBorrowDetail(req, res) {
        const { id } = req.params;
        try {
            const borrow = await borrowServices.getBorrowByIdWithBooksAndBorrower(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại");
            return res.render('borrows/detail', { title: "Chi tiết phiếu mượn", borrow });
        } catch (error) {
            return res.render('borrows/detail', { title: "Chi tiết phiếu mượn", error: error.message, borrow: {} });
        }
    }
    static async renderViewEditBorrow(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể sửa");
            const borrow = await borrowServices.getBorrowByIdWithBooks(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể sửa");
            return res.render('borrows/edit', { title: "Sửa phiếu mượn", borrow });
        } catch (error) {
            return res.redirect('/borrow?error=' + encodeBase64(error.message))
        }
    }


    static async handleCreateBorrow(req, res) {
        const borrower_id = req.user.user_id;
        try {
            const books =  [...req.body.books ];
            if (books.length === 0) throw new Error("Vui lòng chọn sách để mượn");
            
            
            const bookIdsInt = books.map(id => parseInt(id));
            const listBooks = await bookServices.getAllBooks({
                where: {
                    id: bookIdsInt
                }
            }, { attributes: ['id'] });
            // console.log(listBooks);
            
            if (listBooks.length !== bookIdsInt.length) throw new Error("Một số sách không tồn tại trong hệ thống, vui lòng kiểm tra lại");
            const bookFormat = listBooks.map(b => b.id);
            const data = await borrowServices.createBorrow({
                ...req.body,
                borrower_id,
                books: bookFormat
            });

            return res.redirect('/borrow?success=' + encodeBase64("Thêm phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            // return res.render("borrows/add", { title: "Thêm phiếu mượn", error: error.message, borrow: req.body });
        }
    }
    static async handleEditBorrow(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể sửa");
            const borrow = await borrowServices.getBorrowById(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể sửa");
            await borrowServices.updateBorrow(borrow.id, req.body);
            return res.redirect('/borrow?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
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
            if (borrow.status !== "REQUESTED") throw new Error("chỉ có thể cập nhật phiếu mượn ở trạng thái đang yêu cầu mượn");
            const isUpdated = await borrowServices.markAsRejected(borrow.id);
            if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
            return res.redirect('/borrow?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.redirect('/borrow?error=' + encodeBase64(error.message))
        }
    }
    // đánh dấu hủy phiếu mượn
    static async handlerMarkAsCancel(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            const borrow = await borrowServices.getBorrowById(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            if (borrow.status !== "REQUESTED") throw new Error("chỉ có thể cập nhật phiếu mượn ở trạng thái đang yêu cầu mượn");
            const isUpdated = await borrowServices.markAsCancel(borrow.id);
            if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
            return res.redirect('/borrow?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.redirect('/borrow?error=' + encodeBase64(error.message))
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
            if (borrow.status !== BORROW_STATUS_CONSTANTS.REQUESTED) throw new Error("chỉ có thể cập nhật phiếu mượn ở trạng thái Đã duyệt, chờ lấy");
            const isUpdated = await borrowServices.markAsApproved(borrow.id, approver_id);
            if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
            return res.redirect('/borrow?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.redirect('/borrow?error=' + encodeBase64(error.message))
        }
    }
    // đánh dấu quá hạn
    static async handlerMarkAsExpired(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            const borrow = await borrowServices.getBorrowById(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            if (borrow.status !== BORROW_STATUS_CONSTANTS.BORROWED) throw new Error("chỉ có thể cập nhật phiếu mượn ở trạng thái Đang mượn");
            const isUpdated = await borrowServices.markAsExpired(borrow.id);
            if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
            return res.redirect('/borrow?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.redirect('/borrow?error=' + encodeBase64(error.message))
        }
    }
    // đánh dấu đã trả sách
    static async handlerMarkAsReturned(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            const borrow = await borrowServices.getBorrowById(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            if (borrow.status !== BORROW_STATUS_CONSTANTS.BORROWED && borrow.status !== BORROW_STATUS_CONSTANTS.EXPIRED) throw new Error("chỉ có thể cập nhật phiếu mượn ở trạng thái Đang mượn hoặc Quá hạn");
            const isUpdated = await borrowServices.markAsReturned(borrow.id);
            if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
            return res.redirect('/borrow?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.redirect('/borrow?error=' + encodeBase64(error.message))
        }
    }
    // đánh dấu hủy phiếu mượn
    static async handlerMarkAsCanceled(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            const borrow = await borrowServices.getBorrowById(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            if (borrow.status !== BORROW_STATUS_CONSTANTS.BORROWED) throw new Error("chỉ có thể cập nhật phiếu mượn ở trạng thái Đang mượn");
            const isUpdated = await borrowServices.markAsCanceled(borrow.id);
            if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
            return res.redirect('/borrow?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.redirect('/borrow?error=' + encodeBase64(error.message))
        }
    }
    // đánh dấu đã lấy sách
    static async handlerMarkAsBorrowed(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            const borrow = await borrowServices.getBorrowById(id);
            if (!borrow) throw new Error("Phiếu mượn không tồn tại không thể cập nhật");
            if (borrow.status !== BORROW_STATUS_CONSTANTS.APPROVED) throw new Error("chỉ có thể cập nhật phiếu mượn ở trạng thái Đã phê duyệt, chờ lấy");
            const isUpdated = await borrowServices.markAsBorrowed(borrow.id);
            if (!isUpdated) throw new Error("Cập nhật phiếu mượn thất bại");
            return res.redirect('/borrow?success=' + encodeBase64("Cập nhật phiếu mượn thành công"));
        } catch (error) {
            console.log(error);
            return res.redirect('/borrow?error=' + encodeBase64(error.message))
        }
    }

}


module.exports = BorrowController;