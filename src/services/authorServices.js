const authorRepository = require("../repositories/authorRepository");

class AuthorServices {
    static async findAuthorsByName(name) {
        try {
            const authors = await authorRepository.findAuthorsByName(name);
            return authors;
        } catch (error) {
            return {
                rows: [],
                count: 0
            }
        }
    }
    static async getAllAuthors() {
        try {
            return await authorRepository.findAuthors({});
        } catch (error) {
            throw error;
        }
    }
    static async createAuthor(authorData) {
        try {
            return await authorRepository.createAuthor(authorData, {
                fields: ["name"]
            });
        } catch (error) {
            throw error;
        }
    }
    static async updateAuthor(id, authorData) {
        try {
            const author = await authorRepository.findAuthorById(id);
            if (!author) {
                throw new Error("Tác giả không tồn tại không thể cập nhật");
            }
            const isUpdated = await authorRepository.updateAuthor({ id }, authorData, {
                fields: ["name"]
            });
            if (!isUpdated) throw new Error("Cập nhật tác giả thất bại");
            return await authorRepository.findAuthorById(id);
        } catch (error) {
            throw error;
        }
    }
    static async deleteAuthor(id) {
        try {
            const author = await authorRepository.findAuthorByIdWithBooks(id);
            if (!author) {
                throw new Error("Tác giả không tồn tại không thể xóa");
            }
            if (author.books && author.books.length > 0) {
                throw new Error("Tác giả đang có liên kết với sách không thể xóa");
            }
            const isDeleted = await authorRepository.deleteAuthor({ id });
            if (!isDeleted) throw new Error("Xóa tác giả thất bại");
            return isDeleted;
        } catch (error) {
            throw error;
        }
    }
    static async getAuthorDetails(id) {
        try {
            const author = await authorRepository.findAuthorByIdWithBooks(id);
            if (!author) {
                throw new Error("Tác giả không tồn tại");
            }
            return author;
        } catch (error) {
            throw error;
        }
    }

}


module.exports = AuthorServices;