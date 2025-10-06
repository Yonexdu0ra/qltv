const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Borrow = sequelize.define(
  "BorrowDetails",
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "Số lượng phải lớn hơn 0",
        },
        notNull: { msg: "Số lượng không được để trống" },
      },
      defaultValue: 1,
    },
    // đã trả, đang mượn, làm mất, làm hỏng
    status: {
      type: DataTypes.ENUM("BORROWED", "RETURNED"),
      allowNull: false,
        defaultValue: "BORROWED",
        validate: {
            isIn: {
                args: [["BORROWED", "RETURNED"]],
                msg: "Trạng thái không hợp lệ",
            },
            notNull: { msg: "Trạng thái không được để trống" },
        },
    },
    returned_date: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: { msg: "Ngày trả không hợp lệ" },
        },
    },
  },
  {
    tableName: "borrow_details",
    timestamps: true,
  }
);

module.exports = Borrow;
