const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const genareteSlug = require("../utils/generateSlug");
// tạo mới category


const listCategories = JSON.parse(fs.readFileSync(path.join(__dirname, "category.json"), "utf-8"));
const listAuthors = JSON.parse(fs.readFileSync(path.join(__dirname, "author_filter.json"), "utf-8"));
const importCategories = async (Category) => {
    try {

        const categoryFormatted = listCategories.map(category => ({
            name: category.name,
            description: category.description,
            slug: genareteSlug(category.name),
        }))
        const c = await Category.bulkCreate(categoryFormatted, { returning: true });
        // const total = await Category.count();
        console.log(`Đã nhập ${c.length} thể loại`);
    } catch (error) {
        console.log(error.message);

    }
}

const importAuthors = async (Author) => {
    try {

        const authorFormatted = listAuthors.map(author => ({
            name: author.name,
            bio: author.description,
            slug: genareteSlug(author.name),
        }))
        // const uniqueAuthors = [
        //     ...new Map(authorFormatted.map(a => [a.name, a])).values()
        // ];
        const a = await Author.bulkCreate(authorFormatted, { returning: true });
        // const total = await Author.count();
        // console.log(a);

        console.log(`Đã nhập ${a.length} tác giả`);
    } catch (error) {
        console.log(error.message);

    }
}
const listAccount = JSON.parse(fs.readFileSync(path.join(__dirname, "account.json"), "utf-8"));
const listUser = JSON.parse(fs.readFileSync(path.join(__dirname, "user.json"), "utf-8"));
const importAccountsAndUsers = async (Account, User, sequelize) => {
    const transaction = await sequelize.transaction();
    try {
        const u = await User.bulkCreate(listUser, { returning: true, transaction });

        const newAccount = listAccount.map((account, index) => ({
            ...account,
            user_id: u[index].id,
            password: bcrypt.hashSync(account.password, 10)
        }));


        await Account.bulkCreate(newAccount, { returning: true, transaction });
        await transaction.commit();
        console.log(`Đã nhập ${newAccount.length} tài khoản`);
    } catch (error) {
        await transaction.rollback();
        console.log(error.message);

    }
}

const listBooks = JSON.parse(fs.readFileSync(path.join(__dirname, "book_data_filter.json"), "utf-8"));
function randomYear() {
    return Math.floor(Math.random() * (2010 - 1900 + 1)) + 1900;
}
function randomQuantity() {
    return Math.floor(Math.random() * 50) + 1;
}
function randomISBN() {
    let isbn = "978"; // ISBN-13 thường bắt đầu bằng 978 hoặc 979
    for (let i = 0; i < 9; i++) {
        isbn += Math.floor(Math.random() * 10); // thêm 9 chữ số ngẫu nhiên
    }

    // Tính chữ số kiểm tra cuối cùng (checksum) theo chuẩn ISBN-13
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        let num = parseInt(isbn[i]);
        sum += i % 2 === 0 ? num : num * 3;
    }
    let checkDigit = (10 - (sum % 10)) % 10;
    isbn += checkDigit;

    return isbn;
}
const importBooks = async (Book, Author, Genre) => {
    try {
        const authors = await Author.findAll({ attributes: ['id'] });
        const genres = await Genre.findAll({ attributes: ['id'] });

        if (!authors.length || !genres.length)
            throw new Error("Cần có dữ liệu Author và Genre trước khi import sách!");

        const authorIds = authors.map(a => a.id);
        const genreIds = genres.map(g => g.id);

        const chunkSize = 400; // 👈 số lượng sách insert mỗi lần
        let totalCreated = 0;

        for (let i = 0; i < listBooks.length; i += chunkSize) {
            const chunk = listBooks.slice(i, i + chunkSize);

            const booksData = chunk.map(book => {
                const quantity = randomQuantity();
                return {
                    title: book.title,
                    image_cover: book.image_cover,
                    published_year: randomYear(),
                    isbn: randomISBN(),
                    quantity_total: quantity,
                    quantity_available: quantity,
                    description: book.description,
                    slug: genareteSlug(book.title) + "-" + randomQuantity(),
                };
            });

            const createdBooks = await Book.bulkCreate(booksData, { returning: true });

            // Gán ngẫu nhiên tác giả + thể loại
            await Promise.all(createdBooks.map(async (book) => {
                const randomAuthor = authorIds[Math.floor(Math.random() * authorIds.length)];
                const randomGenre = genreIds[Math.floor(Math.random() * genreIds.length)];
                await book.addAuthor(randomAuthor);
                await book.addGenre(randomGenre);
            }));

            totalCreated += createdBooks.length;
            console.log(`✅ Đã nhập ${createdBooks.length} sách (chunk ${Math.ceil((i + 1) / chunkSize)})`);
        }

        console.log(`🎉 Tổng cộng đã nhập ${totalCreated} sách thành công.`);
    } catch (error) {
        console.error("❌ Lỗi importBooks:", error.message);
    }
};




// importCategories();
// console.log(listCategories);


module.exports = {
    importCategories,
    importAuthors,
    importAccountsAndUsers,
    importBooks
}