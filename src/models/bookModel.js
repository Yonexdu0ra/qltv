

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");



const Book = sequelize.define("Books", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Tiêu đề không được để trống" },
            len: { args: [1, 200], msg: "Tiêu đề phải từ 1 đến 200 ký tự" }
        },

    },
    isbn: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: "ISBN không được để trống" },
            len: { args: [10, 13], msg: "ISBN phải từ 10 đến 13 ký tự" }
        }
    },
    published_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Năm xuất bản không được để trống" },
            isInt: { msg: "Năm xuất bản phải là số nguyên" },
            min: { args: [1500], msg: "Năm xuất bản phải lớn hơn 1500" },
            max: { args: [new Date().getFullYear()], msg: "Năm xuất bản không được lớn hơn năm hiện tại" }
        }
    },
    quantity_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Tổng số lượng không được để trống" },
            isInt: { msg: "Tổng số lượng phải là số nguyên" },
            min: { args: [0], msg: "Tổng số lượng phải lớn hơn hoặc bằng 0" }
        }
    },
    quantity_available: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Số lượng có sẵn không được để trống" },
            isInt: { msg: "Số lượng có sẵn phải là số nguyên" },
            min: { args: [0], msg: "Số lượng có sẵn phải lớn hơn hoặc bằng 0" }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_cover: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: { msg: "Ảnh bìa phải là một URL hợp lệ" }
        }
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    // genre_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // },
    // author_id: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "books",
    timestamps: true
})


module.exports = Book;