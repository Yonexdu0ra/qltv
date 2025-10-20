
const userServices = require("../services/userServices");
const encodeBase64 = require("../utils/base64");


class UserController {

    static async renderViewUsers(req, res) {
        try {
            const limit = req.query.limit ? req.query.limit > 0 ? parseInt(req.query.limit) : 10 : 10
            const { count, rows: users } = await userServices.getUsersWithAccountPagination({ limit, ...req.query });
            const totalPages = Math.ceil(count / limit);
            return res.render("users/index", { title: "Quản lý người dùng", users, totals: totalPages, page: req.query.page || 1, query: req.query });
        } catch (error) {
            return res.render("users/index", { title: "Quản lý người dùng", users: [], totals: 0, page: 0, query: req.query, error: error.message });
        }
    }

    static async renderViewUpdateUser(req, res) {
        const { id } = req.params;
        try {
            const user = await userServices.getUserById(id);
            if (!user) throw new Error("Người dùng không tồn tại");
            return res.render("users/edit", { title: "Cập nhật người dùng", user });
        } catch (error) {
            return res.redirect("/users?error=" + encodeBase64(error.message));
        }
    }

    static async handleUpdateUser(req, res) { 
        const { id } = req.params
        try {
            const user = await userServices.getUserById(id);
            if (!user) throw new Error("Người dùng không tồn tại");
            const isUpdated = await userServices.updateUser(user.id, req.body);
            if (!isUpdated) throw new Error("Cập nhật người dùng không thành công");
            return res.redirect("/users?success=" + encodeBase64("Cập nhật người dùng thành công"));
        } catch (error) {
            return res.redirect("/users?error=" + encodeBase64(error.message));
        }
    }



}

module.exports = UserController;