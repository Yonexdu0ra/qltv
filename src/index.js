const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const authenticationMiddleware = require("./middleware/authenticationMiddleware");
const { STATUS_BORROW, BORROW_STATUS_CONSTANTS } = require("./utils/constants")
const { sequelize, Account, User, Genre, Author, Book } = require("./models");
// const { importBooks, importAccountsAndUsers } = require("./seeders");
// const sequelize = require("./config/database");
const { importCategories, importAuthors, importAccountsAndUsers, importBooks } = require("./seeders");
const PORT = process.env.PORT || 3002;



const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);

app.set("layout", "layout");
app.set("layout extractScripts", true);


app.use(express.static(path.join(__dirname, "public")));
// app.use(authenticationMiddleware);
app.use((req, res, next) => {
    res.locals.user = req.user || {};
    res.locals.currentPath = req.path;
    const role = req?.user?.role
    const layout = !role ? false : role === "Reader" ? "layouts/readerLayout" : "layout"
    res.locals.layout = layout
    res.locals.constants = BORROW_STATUS_CONSTANTS
    res.locals.constantsReverse = STATUS_BORROW
    next();
})
routes(app);


(async () => {
    try {
        await sequelize.authenticate();

        // // 🔻 Tắt kiểm tra khóa ngoại
        // await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

        // // 🔻 Lấy danh sách toàn bộ bảng trong DB
        // const tables = await sequelize.query("SHOW TABLES", { type: sequelize.QueryTypes.SHOWTABLES });

        // // 🔻 Xóa sạch toàn bộ bảng
        // for (const table of tables) {
        //     await sequelize.query(`DROP TABLE IF EXISTS \`${table}\``);
        // }

        // // 🔻 Bật lại kiểm tra khóa ngoại
        // await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

        // //🔻 Tạo lại toàn bộ bảng mới
        // await sequelize.sync({ force: true });
        // importAccountsAndUsers(Account,User, sequelize);
        // importAuthors(Author);
        // importCategories(Genre);
        // await new Promise(resolve => setTimeout(resolve, 2000)); // chờ 2s để đảm bảo tác giả được tạo trước khi tạo sách
        // importBooks(Book, Author, Genre);

        console.log("Kết nối đến database thành công");
    } catch (error) {
        console.log(error);
        
        console.error("Không thể kết nối đến database:", error.message);
    }
})();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
