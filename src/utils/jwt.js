const { sign, verify } = require("jsonwebtoken");

const encodeJWT = async (payload, options = {}) => {
    try {
        return sign(payload, process.env.JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "1h",
            ...options,
        });
    } catch (error) {
        return null;
    }
};

const decodeJWT = async (token, options = {}) => {
    try {
        return verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"],
            ...options,
        });
    } catch (error) {
        if (error.name === "TokenExpiredError") return "TokenExpiredError";
        return null;
    }
};

module.exports = { encodeJWT, decodeJWT };