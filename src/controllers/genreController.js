const { genreServices, bookServices } = require("../services/");
const encodeBase64 = require("../utils/base64");
const generateSlug = require("../utils/generateSlug");
class GenreController {
  static async renderViewGenre(req, res) {
    const limit = req.query.limit
      ? req.query.limit > 0
        ? parseInt(req.query.limit)
        : 8
      : 8;
    try {

      const { count: totals, rows: genres } =
        await genreServices.getAllGenresWithPagination({ ...req.query, limit });

      const totalPages = Math.ceil(totals / limit);
      const page = parseInt(req.query.page) || 1;
      return res.render("genres/index", {
        title: "Quản lý thể loại",
        genres,
        totals: totalPages,
        page,
        query: req.query,
      });
    } catch (error) {
      console.log(error);

      return res.render("genres/index", {
        title: "Quản lý thể loại",
        genres: [],
        totals: 0,
        totalPages: 0,
        page: 1,
        error: error.message,
        query: req.query,
      });
    }
  }

  static async renderViewCreateGenre(req, res) {
    try {
      return res.render("genres/add", { title: "Thêm thể loại", genre: {} });
    } catch (error) {
      return res.redirect("/dashboard/genres?error=" + encodeBase64(error.message));
    }
  }
  static async renderViewUpdateGenre(req, res) {
    try {
      const { id } = req.params;
      const genre = await genreServices.getGenreById(id);
      if (!genre) throw new Error("Thể loại không tồn tại");
      return res.render("genres/edit", { title: "Sửa thể loại", genre });
    } catch (error) {
      return res.redirect("/not-found?error=" + encodeBase64(error.message));
    }
  }
  static async renderViewDeleteGenre(req, res) {
    try {
      const { id } = req.params;
      const genre = await genreServices.getGenreById(id);
      if (!genre) throw new Error("Thể loại không tồn tại");
      return res.render("genres/delete", { title: "Xoá thể loại", genre });
    } catch (error) {
      return res.redirect("/not-found?error=" + encodeBase64(error.message));
    }
  }
  static async renderViewDetailGenre(req, res) {
    const { slug } = req.params;
    const { query } = req;
    try {
      const genre = await genreServices.getGenreBySlug(slug);
      if (!genre) throw new Error("Thể loại không tồn tại");
      const limit = query.limit ? (query.limit > 0 ? parseInt(query.limit) : 10) : 10;
      const page = query.page ? parseInt(query.page) : 1;
      const { rows: books, count } = await bookServices.getBooksWithGenresPagination({ ...limit, query, page }, { genreWhere: { id: genre.id }, genreAttributes: [] })
      const totalPages = Math.ceil(count / limit);
      const data = {
        ...genre.toJSON(),
        books,
      }
      return res.render("genres/detail", {
        title: "Chi tiết thể loại",
        genre: data,
        totals: totalPages,
        page,
        query,
      });
    } catch (error) {
      console.log(error);

      return res.redirect("/not-found?error=" + encodeBase64(error.message));
    }
  }
  static async handleCreateGenre(req, res) {
    const { id } = req.params;
    try {
      const { name, description } = req.body;
      if (!name) throw new Error("Vui lòng nhập tên thể loại");
      let slug = generateSlug(name);
      const slugExists = await genreServices.getGenreBySlug(slug, {
        attributes: ["id", "slug"],
      });
      if (slugExists) {
        slug += "-" + Date.now();
      }
      const genre = await genreServices.createGenre(
        { name, slug, description },
        { fields: ["name", "slug", "description"] }
      );
      if (!genre) throw new Error("Tạo thể loại thất bại");
      return res.redirect(
        "/dashboard/genres?success=" + encodeBase64("Thêm thể loại thành công")
      );
    } catch (error) {
      return res.render("genres/add", {
        title: "Thêm thể loại",
        error: error.message,
        genre: req.body,
      });
    }
  }

  static async handleUpdateGenre(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
      let slug = generateSlug(name);
      const genre = await genreServices.getGenreById(id, {
        attributes: ["id", "slug"],
      });
      if (slug !== genre.slug) {
        slug = generateSlug(name) + "-" + Date.now();
      }
      if (!name) throw new Error("Vui lòng nhập tên thể loại");
      const isUpdated = await genreServices.updateGenreById(id, {
        name,
        description,
        slug,
      });
      if (!isUpdated) throw new Error("Cập nhật thể loại thất bại");
      return res.redirect(
        "/dashboard/genres?success=" + encodeBase64("Cập nhật thể loại thành công")
      );
    } catch (error) {
      return res.render("genres/edit", {
        title: "Sửa thể loại",
        error: error.message,
        genre: { id, ...req.body },
      });
    }
  }
  static async handleDeleteGenre(req, res) {
    const { id } = req.params;
    try {
      const genre = await genreServices.getGenreByIdWithBooks(id, {
        attributes: ["id", "name"],
        bookAttributes: ["id"],
      });
      if (genre.books && genre.books.length > 0) {
        throw new Error("Thể loại đang có sách, không thể xoá");
      }
      const isDeleted = await genreServices.deleteGenreById(id);
      if (!isDeleted) throw new Error("Xoá thể loại thất bại");
      return res.redirect(
        "/dashboard/genres?success=" + encodeBase64("Xoá thể loại thành công")
      );
    } catch (error) {
      return res.redirect("/dashboard/genres?error=" + encodeBase64(error.message));
    }
  }
  static async handleSearchGenre(req, res) {
    const { query } = req;
    try {
      const limit = 10;
      const offset = 0;
      const { rows: genres, count: total } =
        await genreServices.getAllGenresWithPagination({
          ...query,
          limit,
          offset,
        }, {
          attributes: ["id", "name", "slug"],
        });
      return res.json({ success: true, data: genres, total });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
        data: [],
        total: 0,
      });
    }
  }
  static async renderViewGenresForReader(req, res) {
    const limit = req.query.limit
      ? req.query.limit > 0
        ? parseInt(req.query.limit)
        : 20
      : 20;
    try {

      const { count: totals, rows: genres } =
        await genreServices.getAllGenresWithPagination({ ...req.query, limit });

      const totalPages = Math.ceil(totals / limit);
      const page = parseInt(req.query.page) || 1;
      return res.render("genres/list", {
        title: "Danh sách thể loại",
        genres,
        totals: totalPages,
        page,
        query: req.query,
      });
    } catch (error) {
     
      return res.render("genres/list", {
        title: "Danh sách thể loại",
        genres: [],
        totals: 0,
        totalPages: 0,
        page: 1,
        error: error.message,
        query: req.query,
      });
    }
  }
}

module.exports = GenreController;
