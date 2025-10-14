




const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");



const BookAuthors = sequelize.define("BookAuthors", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: "bookAuthors",
    timestamps: true
})


module.exports = BookAuthors;