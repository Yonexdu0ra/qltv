

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");



const User = sequelize.define("Users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Họ tên không được để trống" },
            len: { args: [3, 100], msg: "Họ tên phải từ 3 đến 100 ký tự" }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: "Email không hợp lệ" },
            notEmpty: { msg: "Email không được để trống" }
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Địa chỉ không được để trống" },
            len: { args: [5, 200], msg: "Địa chỉ phải từ 5 đến 200 ký tự" }
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Số điện thoại không được để trống" },
            is: { args: /^[0-9]{10,15}$/, msg: "Số điện thoại không hợp lệ" }
        }
    }
}, {
    tableName: "users",
    timestamps: true
})


module.exports = User;