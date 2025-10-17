const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BorrowDetails = sequelize.define(
  "BorrowDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    borrow_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // đã trả, đang mượn, làm mất, làm hỏng
    status: {
      type: DataTypes.ENUM("BORROWED", "RETURNED", "LOST", "DAMAGED"),
      allowNull: false,
      defaultValue: "BORROWED",
      validate: {
        isIn: {
          args: [["BORROWED", "RETURNED", "LOST", "DAMAGED"]],
          msg: "Trạng thái không hợp lệ",
        },
      },
    },
    returned_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: "Ngày trả không hợp lệ" },
      },
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    tableName: "borrowDetail",
    timestamps: true,
  }
);

module.exports = BorrowDetails;
