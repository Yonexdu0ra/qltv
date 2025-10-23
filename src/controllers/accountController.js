
const { sequelize } = require("../models");
const { accountServices, userServices } = require("../services/");
const encodeBase64 = require("../utils/base64");

class AccountController {
    static async renderViewAccounts(req, res) {
        const { query } = req;
        const page = isNaN(parseInt(query.page)) || parseInt(query.page) < 1 ? 1 : parseInt(query.page);
        try {
            const limit = query.limit ? query.limit > 0 ? parseInt(query.limit) :9 : 9
            const { count, rows: accounts } = await accountServices.getAllAccountWithUserPagination({ limit, ...query }, {
                attributes: ['id', 'username', 'role', 'created_at'],
                userAttributes: ['fullname', 'id']
            });
            const totalPages = Math.ceil(count / limit);
            
            return res.render("accounts/index", { title: "Quản lý tài khoản", accounts, totals: totalPages, page, query });
        } catch (error) {
            console.error("Error rendering accounts view:", error.error);
            return res.render("accounts/index", { title: "Quản lý tài khoản", accounts: [], totals: 0, page, query });
        }
    }

    static async renderViewCreateAccount(req, res) {
        return res.render("accounts/add", { title: "Tạo tài khoản", account: {} });
    }

    static async renderViewReissuePassword(req, res) {
        const { id } = req.params;
        try {
            if (!id) throw new Error("Tài khoản không tồn tại");
            const account = await accountServices.getAccountByIdWithUser(id, { attributes: ['id', 'user_id', 'username'], userAttributes: ['fullname', 'id'] });
            if (!account) throw new Error("Tài khoản không tồn tại");
            return res.render("accounts/reissuePassword", { title: "Cấp lại mật khẩu", account });
        } catch (error) {
            console.error("Error rendering reissue password view:", error);
            return res.redirect("/dashboard/accounts?error=" + encodeBase64(error.message));
        }
    }

    static async renderViewDeleteAccount(req, res) {
        const { id } = req.params;
        try {
            const account = await accountServices.findAccountById(id, { attributes: ['id', 'username'] });
            if (!account) throw new Error("Tài khoản không tồn tại không thể xóa");
            return res.render("accounts/delete", { title: "Xóa tài khoản", account });
        } catch (error) {
            console.error("Error rendering delete account view:", error);
            return res.redirect("/dashboard/accounts?error=" + encodeBase64(error.message));
        }
    }
    static async renderViewEditAccount(req, res) {
        const { id } = req.params;
        try {
            const account = await accountServices.getAccountByIdWithUser(id, { attributes: ['id',"username", 'role', 'user_id'], userAttributes: ['fullname', 'email', 'phone', 'address'] });
            if (!account) throw new Error("Tài khoản không tồn tại không thể sửa");
            return res.render("accounts/edit", { title: "Sửa tài khoản", account });
        } catch (error) {
            console.error("Error rendering edit account view:", error);
            return res.redirect("/dashboard/accounts?error=" + encodeBase64(error.message));
        }
    }

    static async handleEditAccount(req, res) {
        const { id } = req.params
        const { fullname, email, phone, address, role } = req.body;
        const transaction = await sequelize.transaction();
        try {
            const account = await accountServices.getAccountById(id, { attributes: ['id', 'user_id'] });
            if (!account) throw new Error("Tài khoản không tồn tại không thể sửa");
            const isAccountUpdated = await accountServices.updateAccountById({ role }, account.id, { transaction, fields: ['role'] });
            if (!isAccountUpdated) throw new Error("Cập nhật tài khoản không thành công");
            const isUserUpdated = await userServices.updateUserById(account.user_id, { fullname, email, phone, address }, { transaction, fields: ['fullname', 'email', 'phone', 'address'] });
            if (!isUserUpdated) throw new Error("Cập nhật người dùng không thành công");
            await transaction.commit();
            return res.redirect('/dashboard/accounts?success=' + encodeBase64("Cập nhật tài khoản thành công"));
        } catch (error) {
            await transaction.rollback();
            console.error("Error editing account:", error);
            return res.redirect("/dashboard/accounts?error=" + encodeBase64(error.message));
        }
    }

    static async renderViewAccountDetail(req, res) {
        const { id } = req.params;
        try {
            const account = await accountServices.getAccountByIdWithUser(id, { attributes: ['id', 'username', 'role', 'created_at'], userAttributes: ['fullname', 'email', 'phone', 'address'] });
            if (!account) throw new Error("Tài khoản không tồn tại");
            return res.render("accounts/detail", { title: "Chi tiết tài khoản", account });
        } catch (error) {
            console.error("Error rendering account detail view:", error);
            return res.redirect("/dashboard/accounts?error=" + encodeBase64(error.message));
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
            }, { transaction, fields: ['fullname', 'email', 'phone', 'address'] });
            if (!user) throw new Error("Tạo người dùng không thành công");
            const account = await accountServices.createAccount({
                username: req.body.username,
                password: req.body.password,
                role: req.body.role,
                user_id: user.id
            }, { transaction, fields: ['username', 'password', 'role', 'user_id'] });
            if (!account) throw new Error("Tạo tài khoản không thành công");
            await transaction.commit();
            return res.redirect('/dashboard/accounts?success=' + encodeBase64("Tạo tài khoản thành công"));
        } catch (error) {
            await transaction.rollback();
            console.error("Error creating account:", error);
            return res.redirect("/dashboard/accounts?error=" + encodeBase64(error.message));
        }
    }

    static async handleReissuePassword(req, res) {
        const { id } = req.params;
        const { password } = req.body;
        const { role } = req.user;
        try {
            const account = await accountServices.getAccountById(id, { attributes: ['id', 'role'] });
            if (!account) throw new Error("Tài khoản không tồn tại không thể đặt lại mật khẩu");
            // chỉ có Quyền admin mới được đặt lại mật khẩu cho các tài khoản khác ngoài Reader
            if (role !== "Admin" && account.role !== "Reader") throw new Error("Bạn không có quyền đặt lại mật khẩu cho tài khoản này");
            const isReissued = await accountServices.reissuePasswordAccountById(account.id, password);
            if (!isReissued) throw new Error("Đặt lại mật khẩu không thành công");
            return res.redirect('/dashboard/accounts?success=' + encodeBase64("Đặt lại mật khẩu thành công"));
        } catch (error) {
            return res.redirect("/dashboard/accounts?error=" + encodeBase64(error.message));
        }
    }

}

module.exports = AccountController;