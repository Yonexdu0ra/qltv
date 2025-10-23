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

    //  đang mượn, đã trả, làm mất, làm hỏng, hết hạn, đã yêu cầu, đã hủy, đã duyệt, bị từ chối
    status: {
      type: DataTypes.ENUM("BORROWED", "RETURNED", "LOSTED", "DAMAGED", "EXPIRED", "REQUESTED", "CANCELLED", "APPROVED", "REJECTED"),
      allowNull: false,
      defaultValue: "REQUESTED",
      validate: {
        isIn: {
          args: [["BORROWED", "RETURNED", "LOSTED", "DAMAGED", "EXPIRED", "REQUESTED", "CANCELLED", "APPROVED", "REJECTED"]],
          msg: "Trạng thái không hợp lệ",
        },
      },
    },
    returned_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: "Ngày trả không hợp lệ" },
        isAfter: {
          args: new Date().toISOString(),
          msg: "Ngày trả phải sau ngày mượn",
        },
      },
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    tableName: "BorrowDetails",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = BorrowDetails;
