const bcrypt = require('bcrypt');
const { encodeJWT } = require('../utils/jwt');
const accountRepository = require('../repositories/accountRepository');
class AuthServices {

    static async handleLogin(username, password) {
        try {
            const account = await accountRepository.findAccountWithUser({ username });
            if (!account) {
                throw new Error('Tài khoản không tồn tại');
            }
            const isPasswordValid = await bcrypt.compare(password, account.password);
            
            if (!isPasswordValid) {
                throw new Error('Mật khẩu không chính xác vui lòng thử lại');
            }
            const dataEncode = {
                id: account.id,
                username: account.username,
                role: account.role,
                user_id: account.user_id,
                fullname: account.user.fullname
            }
            const access_token = await encodeJWT(dataEncode, { expiresIn: '15m' });
            const refresh_token = await encodeJWT(dataEncode, { expiresIn: '7d' });
            return {
                access_token,
                refresh_token,
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthServices;