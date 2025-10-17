
const { BorrowDetail } = require("../models");







class BorrowDetailRepository {

    static async createBorrowDetail(data, options = {}) {
        return BorrowDetail.create(data, options);
    }
}





module.exports = BorrowDetailRepository;