const AuthServices = require("../services/authServices");

class AuthController {
    static renderViewLogin(req, res) {
        return res.render("auth/login", { title: "Đăng nhập", layout: false });
    }
    static renderViewChangePassword(req, res) {
        return res.render("auth/changePassword", { title: "Đổi mật khẩu" });
    }
    static async handleLogin(req, res) {
        try {
            let { username, password } = req.body;
            if (!username) throw new Error("Vui lòng nhập username");
            if (!password) throw new Error("Vui lòng nhập password");
            username = username.toLowerCase().trim();
            password = password.trim();
            const { access_token, refresh_token, role } = await AuthServices.handleLogin(username, password);
            const TIME_ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 7 Ngày
            res.cookie('refresh_token', refresh_token, { httpOnly: true, maxAge: TIME_ONE_WEEK, sameSite: 'lax' });
            res.cookie('access_token', access_token, { httpOnly: true, maxAge: TIME_ONE_WEEK, sameSite: 'lax' });
            const directUrl = req.query.redirect || role === "Reader" ? "/" : "/dashboard";
            return res.redirect(directUrl);
        } catch (error) {
            console.log(error.message);
            return res.render("auth/login", { title: "Đăng nhập", layout: false, error: error.message });
        }
    }
    static async handleLogout(req, res) {
        const { id } = req.params;
        const user_id = req.user.user_id
        try {
            if (id != user_id) throw new Error("Đăng xuất thất bại");
            res.clearCookie('refresh_token');
            res.clearCookie('access_token');
            return res.redirect("/auth/login");
        } catch (error) {
            console.log(error.message);
            return res.redirect("/");
        }
    }
}

module.exports = AuthController;