const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");


const fileData = fs.readFileSync(path.join(__dirname, '..', 'ssl','certificate.pem'), 'utf8');


const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DIALECT || 'mysql',
    logging: false,
    dialectOptions: {
        ssl: {
            ca: fileData
        }
    }
});


module.exports = sequelize;
