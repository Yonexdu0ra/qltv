

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");



const Fine = sequelize.define("Fines", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: "Số tiền phạt phải là một số hợp lệ" },
            min: { args: [0], msg: "Số tiền phạt phải lớn hơn hoặc bằng 0" }
        }
    },
    status: {
        type: DataTypes.ENUM("UNPAID", "PAID", "LOST", "DAMAGED"),
        allowNull: false,
        validate: {
            isIn: {
                args: [["UNPAID", "PAID", "LOST", "DAMAGED"]],
                msg: "Trạng thái không hợp lệ"
            },
            notNull: { msg: "Trạng thái không được để trống" }
        },
        defaultValue: "UNPAID",
    },
    borrow_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
   
}, {
    tableName: "fines",
    timestamps: true
})


module.exports = Fine;