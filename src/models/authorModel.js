

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");



const Author = sequelize.define("Authors", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Tên tác giả không được để trống" },
            len: { args: [3, 100], msg: "Tên tác giả phải từ 3 đến 100 ký tự" }
        }
    }
}, {
    tableName: "authors",
    timestamps: true
})


module.exports = Author;