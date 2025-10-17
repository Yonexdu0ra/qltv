const fineRepository = require('../repositories/fineRepository');

class FineServices {
    static async getFines(query, options) {
        return fineRepository.findFines(query, options);
    }
    static async getFilesPagination(query) {
        const where = {};
        if (query) {
            where.status = {
                [Op.like]: `%${query}%`
            };
        }
        const limit = 10;
        const offset = 0;
        const order = [["amount", "ASC"]];
        const options = { attributes: ["id", "amount", 'status', 'borrow_detail_id'] };
        return fineRepository.findFilesPagination(where, limit, offset, order, options);
    }
    static async getFineByIdWithBookAndBorrower(id) {
        return fineRepository.findFineByIdWithBookAndBorrower(id);
    }
    static async getFinesPaginationWithBorrowAndBorrower(query) {
        const where = {};
        if (query) {
            where.status = {
                [Op.like]: `%${query}%`
            };
        }
        const limit = 10;
        const offset = 0;
        const order = [["amount", "ASC"]];
        const options = { attributes: ["id", "amount", 'status', 'borrow_detail_id'] };
        return fineRepository.findFilesPaginationWithBorrowDetailAndBorrower(where, limit, offset, order, options);
    }
    static async getFine(id, options) {
        return fineRepository.findFine(id, options);
    }
    static async createFine(data, options) {
        return fineRepository.createFine(data, options);
    }
    static async updateFine(id, data, options) {
        return fineRepository.updateFine(id, data, options);
    }
}


module.exports = FineServices;