const borrowDetailRepository = require("../repositories/borrowDetailRepository");


class BorrowDetailServices {
    static async createBorrowDetail(data, options = {}) {
        try {
            const borrowDetail = await borrowDetailRepository.createBorrowDetail(data, {
                ...options,
                include: [{ model: Book, as: "book" }],
            });
            return borrowDetail;
        } catch (error) {
            throw new Error("Error creating borrow detail");
        }
    }
}
module.exports = BorrowDetailServices;