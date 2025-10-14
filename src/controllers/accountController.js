
const { sequelize } = require("../models");
const accountServices = require("../services/accountServices");
const userServices = require("../services/userServices");
const encodeBase64 = require("../utils/base64");

class AccountController {
    static async renderViewAccounts(req, res) {
        try {
            const limit = req.query.limit ? req.query.limit > 0 ? parseInt(req.query.limit) : 10 : 10
            const { count, rows: accounts } = await accountServices.findAccountsPaginationWithUser({ limit, ...req.query });
            const totalPages = Math.ceil(count / limit);

            return res.render("accounts/index", { title: "Quản lý tài khoản", accounts, totals: totalPages, page: req.query.page || 1, query: req.query });
        } catch (error) {
            console.error("Error rendering accounts view:", error);
            return res.render("accounts/index", { title: "Quản lý tài khoản", accounts: [], totals: 0, page: 0, query: req.query });
        }
    }

    static async renderViewCreateAccount(req, res) {
        return res.render("accounts/add", { title: "Tạo tài khoản", account: {} });
    }

    static async renderViewReissuePassword(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Tài khoản không tồn tại");
            const account = await accountServices.findAccountByIdWithUser(id);

            if (!account) throw new Error("Tài khoản không tồn tại");
            return res.render("accounts/reissuePassword", { title: "Cấp lại mật khẩu", account });
        } catch (error) {
            console.error("Error rendering reissue password view:", error);
            return res.redirect("/accounts?error=" + encodeBase64(error.message));
        }
    }

    static async renderViewDeleteAccount(req, res) {
        const { id } = req.params;
        try {
            const account = await accountServices.findAccountById(id);
            console.log(account);

            if (!account) throw new Error("Tài khoản không tồn tại");
            return res.render("accounts/delete", { title: "Xóa tài khoản", account });
        } catch (error) {
            console.error("Error rendering delete account view:", error);
            return res.redirect("/accounts?error=" + encodeBase64(error.message));
        }
    }

    static async handleCreateAccount(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const user = await userServices.createUser({
                fullname: req.body.fullname,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address
            }, { transaction });
            if (!user) throw new Error("Tạo người dùng không thành công");
            const account = await accountServices.createAccount({
                username: req.body.username,
                password: req.body.password,
                role: req.body.role,
                user_id: user.id
            }, { transaction });
            if (!account) throw new Error("Tạo tài khoản không thành công");
            await transaction.commit();
            return res.redirect('/accounts?success=' + encodeBase64("Tạo tài khoản thành công"));
        } catch (error) {
            console.error("Error creating account:", error);
            await transaction.rollback();
            return res.redirect("/accounts?error=" + encodeBase64(error.message));
        }
    }

    static async handleReissuePassword(req, res) {
        const { id } = req.params;
        const { password } = req.body;
        const { role } = req.user;
        try {
            if (!id) throw new Error("Tài khoản không tồn tại");
            const account = await accountServices.findAccountById(id);
            if (!account) throw new Error("Tài khoản không tồn tại");
            if(role !== "Admin" && account.role !== "Reader") throw new Error("Bạn không có quyền đặt lại mật khẩu cho tài khoản này");
            const isReissued = await accountServices.reissuePassword(account.id, password);
            if (!isReissued) throw new Error("Đặt lại mật khẩu không thành công");
            return res.redirect('/accounts?success=' + encodeBase64("Đặt lại mật khẩu thành công"));
        } catch (error) {
            return res.redirect("/accounts?error=" + encodeBase64(error.message));
        }
    }
    static async handleDeleteAccount(req, res) { }
}

module.exports = AccountController;