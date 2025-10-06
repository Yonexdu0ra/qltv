const sequelize = require("../config/database");
const User = require("./userModel");
const Book = require("./bookModel");
const Author = require("./authorModel");
const Genre = require("./genreModel");
const Borrow= require("./borrowTransactionModel");
const Fine = require("./fineModel");
const Account = require("./accountModel");
const BorrowDetail = require("./borrowDetailModel");




// User - Account: 1-1
User.hasOne(Account, { foreignKey: "user_id", as: "account" });
Account.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Category - Book: N-N
Genre.belongsToMany(Book, { foreignKey: "genre_id", through: "BookCategories", as: "books" });
Book.belongsToMany(Genre, { foreignKey: "genre_id", through: "BookGenres", as: "genres" });


// Author - Book: N-N
Author.belongsToMany(Book, { foreignKey: "author_id", through: "AuthorBooks", as: "books" });
Book.belongsToMany(Author, { foreignKey: "author_id", through: "AuthorBooks", as: "authors" });

// Borrow - Reader: N-1
Borrow.belongsTo(User, { foreignKey: "borrower_id", as: "borrower" });
User.hasMany(Borrow, { foreignKey: "borrower_id", as: "borrows" });

// Borrow - Librarian(User): N-1
Borrow.belongsTo(User, { foreignKey: "approver_id", as: "approver" });
User.hasMany(Borrow, { foreignKey: "approver_id", as: "approvedBorrows" });

// Borrow - BorrowDetail: 1-N
Borrow.hasMany(BorrowDetail, { foreignKey: "borrow_id", as: "borrowDetails" });
BorrowDetail.belongsTo(Borrow, { foreignKey: "borrow_id", as: "borrow" });

// Book - BorrowDetail: 1-N
Book.hasMany(BorrowDetail, { foreignKey: "book_id", as: "borrowDetails" });
BorrowDetail.belongsTo(Book, { foreignKey: "book_id", as: "book" });

// BorrowDetail - Fine: 1-1
BorrowDetail.hasOne(Fine, { foreignKey: "borrow_detail_id", as: "fine" });
Fine.belongsTo(BorrowDetail, { foreignKey: "borrow_detail_id", as: "borrowDetail" });


module.exports = {
    User,
    Book,
    Author,
    Genre,
    Borrow,
    Fine,
    Account,
    BorrowDetail,
    sequelize
}
