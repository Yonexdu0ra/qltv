const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Fine = sequelize.define(
  "Fines",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Số tiền phạt phải là một số hợp lệ" },
        min: { args: [0], msg: "Số tiền phạt phải lớn hơn hoặc bằng 0" },
      },
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    borrow_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "fines",
    timestamps: true,
  }
);

module.exports = Fine;
