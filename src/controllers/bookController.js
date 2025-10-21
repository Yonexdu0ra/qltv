const { sequelize } = require("../models");
const { authorServices, genreServices, bookServices } = require("../services");
const encodeBase64 = require("../utils/base64");
const genaraterSlug = require("../utils/generateSlug");

class BookController {
  static async renderViewBooks(req, res) {
    const { query } = req;
    const limit = query.limit
      ? query.limit > 0
        ? parseInt(query.limit)
        : 5
      : 5;
    const page =
      isNaN(parseInt(query.page)) || parseInt(query.page) < 1
        ? 1
        : parseInt(query.page);
    try {
      const { rows: books, count: totals } =
        await bookServices.getBooksWithPagination({ ...query, limit });
      const totalPages = Math.ceil(totals / limit);
      return res.render("books/index", {
        books,
        totals: totalPages,
        page,
        query,
        title: "Quản lý sách",
      });
    } catch (error) {
      console.log("error render view books " + error.message);
      return res.render("books/index", {
        books: [],
        totals: 0,
        page,
        error: error.message,
        query,
        title: "Quản lý sách",
      });
    }
  }
  static async renderViewCreateBook(req, res) {
    try {
      return res.render("books/add", { title: "Thêm sách" });
    } catch (error) {
      console.log("error render view create book " + error.message);
      return res.redirect("/not-found?error=" + encodeBase64(error.message));
    }
  }
  static async renderViewEditBook(req, res) {
    const { id } = req.params;
    try {
      if (!id) throw new Error("Sách không tồn tại không thể sửa");
      const book = await bookServices.getBookByIdWithAuthorsAndGenres(id, {
        authorAttributes: ["id", "name"],
        genreAttributes: ["id", "name"],
        attributes: [
          "id",
          "title",
          "isbn",
          "description",
          "image_cover",
          "published_year",
          "quantity_total",
          "quantity_available",
          "slug"
        ],
      });


      if (!book) throw new Error("Sách không tồn tại không thể sửa");
      return res.render("books/edit", { book, title: "Sửa sách" });
    } catch (error) {
      console.log(error);

      return res.redirect("/dashboard/dashboard/books?error=" + encodeBase64(error.message));
    }
  }
  static async renderViewDeleteBook(req, res) {
    const { id } = req.params;
    try {
      if (!id) throw new Error("Sách không tồn tại không thể xóa");
      const book = await bookServices.getBookById(id);
      if (!book) throw new Error("Sách không tồn tại không thể sửa");
      return res.render("books/delete", { book, title: "Xóa sách" });
    } catch (error) {
      return res.redirect("/dashboard/dashboard/books?error=" + encodeBase64(error.message));
    }
  }
  static async renderViewDetailBook(req, res) {
    const { slug } = req.params;
    try {
      const book = await bookServices.getBookBySlugWithAuthorsAndGenres(slug);
      if (!book) throw new Error("Sách không tồn tại");
      return res.render("books/detail", { book, title: "Chi tiết sách" });
    } catch (error) {
      return res.redirect("/not-found?error=" + encodeBase64(error.message));
    }
  }

  static async handleCreateBook(req, res) {
    const image_cover = req.file?.path || null;
    const body = req.body || {};
    const transaction = await sequelize.transaction();
    try {
      const authors = body.authors || [];
      const genres = body.genres || [];
      if (authors.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một tác giả cho sách");
      }
      if (genres.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một thể loại cho sách");
      }
      const authorsData = await authorServices.getAllAuthorByIds(authors, {
        attributes: ["id"],
      });
      const genresData = await genreServices.getAllGenreByIds(genres, {
        attributes: ["id"],
      });
      if (authorsData.length !== authors.length) {
        throw new Error("Một số tác giả không tồn tại trong hệ thống");
      }
      if (genresData.length !== genres.length) {
        throw new Error("Một số thể loại không tồn tại trong hệ thống");
      }
      let slug = genaraterSlug(body.title);
      const existingBook = await bookServices.getBookBySlug(slug, { attributes: ["id"] });
      if (existingBook) {
        slug = `${slug}-${Date.now()}`;
      }
      const book = await bookServices.createBook(
        { ...body, image_cover, slug },
        {
          fields: [
            "title",
            "description",
            "image_cover",
            "published_year",
            "quantity_total",
            "quantity_available",
            "slug",
            "isbn",
            'description',
          ],
          transaction,
        }
      );
      await book.addAuthors(authorsData, { transaction });
      await book.addGenres(genresData, { transaction });

      await transaction.commit();
      return res.redirect(
        "/dashboard/books?success=" + encodeBase64("Thêm sách thành công")
      );
    } catch (error) {
      await transaction.rollback();
      console.log(error);

      return res.render("books/add", {
        title: "Thêm sách",
        error: error.message,
        book: req.body,
      });
    }
  }
  static async handleEditBook(req, res) {
    const { id } = req.params;
    const image_cover = req.file?.path || null;
    const body = req.body || {};
    const transaction = await sequelize.transaction()


    try {
      const authors = body.authors || [];
      const genres = body.genres || [];
      if (authors.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một tác giả cho sách");
      }
      if (genres.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một thể loại cho sách");
      }
      const authorsData = await authorServices.getAllAuthorByIds(authors, {
        attributes: ["id"],
      });
      const genresData = await genreServices.getAllGenreByIds(genres, {
        attributes: ["id"],
      });
      if (authorsData.length !== authors.length) {
        throw new Error("Một số tác giả không tồn tại trong hệ thống");
      }
      if (genresData.length !== genres.length) {
        throw new Error("Một số thể loại không tồn tại trong hệ thống");
      }
      const book = await bookServices.getBookById(id, { attributes: ["id"] });
      if (!book) {
        throw new Error("Sách không tồn tại không thể cập nhật");
      }
      const isUpdated = await bookServices.updateBookById(
        { ...body, image_cover: image_cover ? image_cover : book.image_cover },
        book.id,
        {
          fields: [
            "title",
            "description",
            "image_cover",
            "published_year",
            "quantity_total",
            "quantity_available",
            "slug"
          ],
          transaction,
        }
      );
      if (!isUpdated) {
        throw new Error("Cập nhật sách thất bại");
      }
      await book.setAuthors(authorsData, { transaction });
      await book.setGenres(genresData, { transaction });

      await transaction.commit();
      return res.redirect(
        "/dashboard/dashboard/books?success=" + encodeBase64("Cập nhật sách thành công")
      );
    } catch (error) {
      await transaction.rollback();
      console.log(error.message);

      return res.redirect(
        "/books/edit/" + req.params.id + "?error=" + encodeBase64(error.message)
      );
    }
  }
  static async handleDeleteBook(req, res) {
    const { id } = req.params;
    try {
      const book = await bookServices.getBookById(id);
      if (!book) throw new Error("Sách không tồn tại không thể xóa");
      const isDeleted = await bookServices.deleteBookById(book.id);
      if (!isDeleted) throw new Error("Xóa sách thất bại");
      return res.redirect(
        "/dashboard/books?success=" + encodeBase64("Xóa sách thành công")
      );
    } catch (error) {
      return res.redirect("/dashboard/dashboard/books?error=" + encodeBase64(error.message));
    }
  }
  static async handleSearchBooks(req, res) {
    const { query } = req;
    try {
      const { rows: books, count: total } =
        await bookServices.getBooksWithPagination(query, {
          attributes: ["id", "title"],
        });
      return res.json({ success: true, data: books, total });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
        data: [],
        total: 0,
      });
    }
  }
  static async renderViewBooksForReader(req, res) {
    const { query } = req;
    const limit = query.limit
      ? query.limit > 0
        ? parseInt(query.limit)
        : 5
      : 5;
    const page =
      isNaN(parseInt(query.page)) || parseInt(query.page) < 1
        ? 1
        : parseInt(query.page);
    try {
      const { rows: books, count: totals } =
        await bookServices.getBooksWithPagination({ ...query, limit });
      const totalPages = Math.ceil(totals / limit);
      return res.render("books/list", {
        books,
        totals: totalPages,
        page,
        query,
        title: "Danh sách sách",
      });
    } catch (error) {
      console.log("error render view books " + error.message);
      return res.render("books/list", {
        books: [],
        totals: 0,
        page,
        error: error.message,
        query,
        title: "Danh sách sách",
      });
    }
  }
}

module.exports = BookController;
