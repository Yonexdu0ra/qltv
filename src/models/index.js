const sequelize = require("../config/database");
const User = require("./userModel");
const Book = require("./bookModel");
const Author = require("./authorModel");
const Genre = require("./genreModel");
const Borrow= require("./borrowTransactionModel");
const Fine = require("./fineModel");
const Account = require("./accountModel");
const BorrowDetail = require("./borrowDetailModel");
const BookAuthors = require("./bookAuthorsModel");
const BookGenres = require("./bookGenresModel");


// User - Account: 1-1
User.hasOne(Account, { foreignKey: "user_id", as: "account" });
Account.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Category - Book: N-N
Genre.belongsToMany(Book, { foreignKey: "genre_id", otherKey: "book_id", through: BookGenres, as: "books" });
Book.belongsToMany(Genre, { foreignKey: "book_id", otherKey: "genre_id", through: BookGenres, as: "genres" });


// Author - Book: N-N
Author.belongsToMany(Book, { foreignKey: "author_id", otherKey: "book_id", through: BookAuthors, as: "books" });
Book.belongsToMany(Author, { foreignKey: "book_id", otherKey: "author_id", through: BookAuthors, as: "authors" });

// Borrow - Reader: N-1
Borrow.belongsTo(User, { foreignKey: "borrower_id", as: "borrower" });
User.hasMany(Borrow, { foreignKey: "borrower_id", as: "borrows" });

// Borrow - Librarian(User): N-1
Borrow.belongsTo(User, { foreignKey: "approver_id", as: "approver" });
User.hasMany(Borrow, { foreignKey: "approver_id", as: "approvedBorrows" });

// Borrow - Book N-N

Borrow.belongsToMany(Book, { foreignKey: "borrow_id", otherKey: "book_id", through: BorrowDetail, as: "books" });
Book.belongsToMany(Borrow, { foreignKey: "book_id", otherKey: "borrow_id", through: BorrowDetail, as: "borrows" });

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
