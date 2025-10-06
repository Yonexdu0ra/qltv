
class AuthController {
    static renderViewLogin(req, res) {
        return res.render("auth/login", { title: "Đăng nhập", layout: null });
    }
}

module.exports = AuthController;