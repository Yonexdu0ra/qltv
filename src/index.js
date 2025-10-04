const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
// const routes = require("./routes");
const cookieParser = require("cookie-parser");
// const authMiddleware = require("./middleware/authMiddleware");

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

app.get("/", (req, res) => {
    return res.send("Hello World");
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
