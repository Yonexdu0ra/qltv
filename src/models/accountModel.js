

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Account = sequelize.define("Accounts", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: "Tên đăng nhập đã tồn tại vui lòng chọn tên khác"
        },
        validate: {
            notEmpty: { msg: "Tên đăng nhập không được để trống" },
            len: { args: [5, 25], msg: "Tên đăng nhập phải từ 5 đến 25 ký tự" }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Mật khẩu không được để trống" },
            len: { args: [6, 100], msg: "Mật khẩu phải từ 6 đến 100 ký tự" }
        }
    },
    role: {
        type: DataTypes.ENUM("Admin", "Librarian", "Reader"),
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: "Accounts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
})


module.exports = Account;