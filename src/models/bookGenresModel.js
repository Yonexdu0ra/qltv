




const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");



const BookGenres = sequelize.define("BookGenres", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    genre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: "bookGenres",
    timestamps: true
})


module.exports = BookGenres;