

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Borrow = sequelize.define(
  "Borrows",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    borrow_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: { msg: "Ngày mượn không hợp lệ" },
        notNull: { msg: "Ngày mượn không được để trống" },
      },
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: "Ngày trả không hợp lệ" },
      },
    },
    pickup_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: "Ngày lấy không hợp lệ" },
      },
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: "Ngày đến hạn không hợp lệ" },
        notNull: { msg: "Ngày đến hạn không được để trống" },
      },
    },
    status: {
      type: DataTypes.ENUM(
        "REQUESTED",
        "APPROVED",
        "BORROWED",
        "RETURNED",
        "EXPIRED",
        "REJECTED",
        "CANCELLED",
      ),
      allowNull: false,
      defaultValue: "REQUESTED",
    },

    borrower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    approver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Borrows",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);


module.exports = Borrow;