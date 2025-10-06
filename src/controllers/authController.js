const AuthServices = require("../services/authServices");

class AuthController {
    static renderViewLogin(req, res) {
        return res.render("auth/login", { title: "Đăng nhập", layout: null });
    }

    static async handleLogin(req, res) {
        try {
            let { username, password } = req.body;
            if (!username) throw new Error("Vui lòng nhập username");
            if (!password) throw new Error("Vui lòng nhập password");
            username = username.toLowerCase().trim();
            password = password.trim();
            const { access_token, refresh_token } = await AuthServices.handleLogin(username, password);
            const TIME_ONE_WEEK = 7 * 24 * 60 * 60 * 1000; // 7 days
            const TIME_FIFTEEN_MINUTES = 15 * 60 * 1000; // 15 minutes
            res.cookie('refresh_token', refresh_token, { httpOnly: true, maxAge: TIME_ONE_WEEK, sameSite: 'lax' });
            res.cookie('access_token', access_token, { httpOnly: true, maxAge: TIME_FIFTEEN_MINUTES, sameSite: 'lax' });
            return res.redirect("/");
        } catch (error) {
            console.log(error.message);
            return res.render("auth/login", { title: "Đăng nhập", layout: null, error: error.message });
        }
    }
}

module.exports = AuthController;