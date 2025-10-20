

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
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: "Slug đã tồn tại, vui lòng chọn slug khác",

        },
        validate: {
            notEmpty: { msg: "Slug không được để trống" },
        }
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: "Authors",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})


module.exports = Author;