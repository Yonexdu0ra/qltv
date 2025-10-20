const userServices = require("./userServices");
const genreServices = require("./genreServices");
const accountServices = require("./accountServices");
const bookServices = require("./bookServices");
const authorServices = require("./authorServices");
const borrowServices = require("./borrowServices");
const authorServices = require("./authorServices");
const fineServices = require("./fineServices");
const borrowDetailServices = require("./borrowDetailServices");
module.exports = {
    userServices,
    genreServices,
    accountServices,
    bookServices,
    authorServices,
    borrowServices,
    fineServices,
    borrowDetailServices
}