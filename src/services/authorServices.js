const { Op } = require("sequelize");
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
    static async getAuthorsPagination(options, queryOptions) {
        try {
            const where = {}
            if(options.q) {
                where.name = {
                    [Op.like]: `%${options.q}%`
                }
            }
            const limit = options.limit ? options.limit > 0 ? parseInt(options.limit) : 10 : 10
            const page = isNaN(parseInt(options.page)) || parseInt(options.page) < 1 ? 1 : parseInt(options.page)
            const offset = (page - 1) * limit
            
            
            const [sortBy, sortOrder] = options.sort ? options.sort.split("-") : ["name", "ASC"]
            
            const order = [[sortBy, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"]]
            return await authorRepository.findAuthorsPagination({ where, limit, offset, order }, queryOptions);
        } catch (error) {
            throw error;
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
    static async getAuthorById(id) {
        try {
            return await authorRepository.findAuthorById(id);
        } catch (error) {
            throw error;
        }
    }
    static async searchAuthors(query) {
        try {
            const where = {
                name: {
                    [Op.like]: `%${query|| ""}%`
                }
            }
            const limit = 10
            const offset = 0
            const order = [["name", "ASC"]]
            const options = { attributes: ["id", "name"], distinct: true, };
            return await authorRepository.findAuthorsPagination({ where, limit, offset, order }, options);

        } catch (error) {
            throw error;
        }
    }
}


module.exports = AuthorServices;