const fileServices = require('../services/fineServices');
const encodeBase64 = require('../utils/base64');
class FineController {
    static async renderViewFines(req, res, next) {
        try {
    // findFilesPaginationWithBorrowDetailAndBorrower
            const { rows: fines, count } = await fileServices.getFinesPaginationWithBorrowAndBorrower(); 
             const limit = req.query.limit ? req.query.limit > 0 ? parseInt(req.query.limit) : 10 : 10
            // console.log(borrows.map(b => b.toJSON())[0]);


            const totalPages = Math.ceil(count / limit);
            const page = parseInt(req.query.page) || 1;
            // return res.json({ title: "Quản lý phạt", fines, totals: totalPages, page, query: req.query });
            return res.render('fines/index', { title: "Quản lý phạt", fines, totals: totalPages, page, query: req.query });
            
        } catch (error) {
            console.log(error.message);
            // return res.json({ title: "Quản lý phạt", fines: [], totals: 0, page: 1, query: req.query, error: error.message });
            
            return res.render('fines/index', { title: "Quản lý phạt", fines: [], totals: 0, page: 1, query: req.query, error: error.message });
            
        }
    }
    static async renderViewFinesByReader(req, res, next) {
        const { user_id} = req.user
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
            const fine = await fileServices.getFineByIdWithBookAndBorrower(id);
            if(!fine) throw new Error('Phí không tồn tại');
            return res.render('fines/detail', { title: "Chi tiết phí", fine });
        } catch (error) {
            return res.redirect('/fines?error=' + encodeBase64(error.message));
        }
    }

    static async renderViewCreateFine(req, res, next) {
        try {
            return res.render('fines/add', { title: "Thêm phí", fine: {} });
        } catch (error) {
            return next(error);
        }
    }
    static renderViewEditFine(req, res, next) {
        try {
            return res.render('fines/edit', { title: "Chỉnh sửa phí", fine: {} });
        } catch (error) {
            return next(error);
        }
    }

    static async handlerCreateFine(req, res, next) {
        try {
            
        } catch (error) {
            
        }
    }

    static async handlerEditFine(req, res, next) {}
}


module.exports = FineController;