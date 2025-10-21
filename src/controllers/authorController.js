const authorService = require("../services/authorServices");
const generateSlug = require("../utils/generateSlug");
const encodeBase64 = require("../utils/base64");
const { bookServices, authorServices } = require("../services");

class AuthorController {
  static async renderViewAuthor(req, res) {
    const { query } = req;

    const page = parseInt(req.query.page) || 1;
    try {
      const limit = parseInt(req.query.limit) || 10;
      const { rows: authors, count: totals } =
        await authorService.getAuthorsWithPagination({ ...query, limit });
      const totalPages = Math.ceil(totals / limit);
      return res.render("authors/index", {
        authors,
        totals: totalPages,
        title: "Quản lý tác giả",
        page,
        query,
      });
    } catch (error) {
      console.log("error render view author " + error.message);
      return res.render("authors/index", {
        authors: [],
        totals: 0,
        page,
        title: "Quản lý tác giả",
        error: error.message,
        query,
      });
    }
  }
  static renderViewCreateAuthor(req, res) {
    try {
      return res.render("authors/add", { title: "Thêm tác giả", author: {} });
    } catch (error) {
      console.log("error render view create author " + error.message);
      return res.render("authors/add", {
        title: "Thêm tác giả",
        error: error.message,
        author: {},
      });
    }
  }
  static async renderViewUpdateAuthor(req, res) {
    const { id } = req.params;
    try {
      const author = await authorService.getAuthorById(id);
      if (!author) throw new Error("Tác giả không tồn tại không thể cập nhật");
      return res.render("authors/edit", { title: "Cập nhật tác giả", author });
    } catch (error) {
      console.log(error);
      return res.redirect("/not-found?error=" + encodeBase64(error.message));
    }
  }
  static async renderViewDeleteAuthor(req, res) {
    const { id } = req.params;
    try {
      const author = await authorService.getAuthorById(id);
      if (!author) throw new Error("Tác giả không tồn tại không thể xóa");
      return res.render("authors/delete", { title: "Xóa tác giả", author });
    } catch (error) {
      return res.redirect("/not-found?error=" + encodeBase64(error.message));
    }
  }
  static async renderViewDetailAuthor(req, res) {
    const { slug } = req.params;
    const { query } = req;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    try {
      const author =
        await authorService.getAuthorBySlug(slug);
      if (!author) throw new Error("Tác giả không tồn tại");
      const { rows: books, count } = await bookServices.getBooksWithAuthorPagination({ ...limit, query, page }, { authorWhere: { id: author.id }, authorAttributes: [] })
      const totalPages = Math.ceil(count / limit);
      const data = {
        ...author.toJSON(),
        books,
      }
      return res.render("authors/detail", {
        title: "Chi tiết tác giả",
        author: data,
        totals: totalPages,
        page,
        query,
      });
    } catch (error) {
      console.log("error render view detail author " + error.message);
      return res.redirect("/not-found?error=" + encodeBase64(error.message));
    }
  }

  static async handleCreateAuthor(req, res) {
    try {
      let { name, bio } = req.body;
      name = name.trim();
      bio = bio ? bio.trim() : "";
      let slug = generateSlug(name);
      // kiểm tra xem đã có slug chưa, nếu có thì thêm timestamp vào để tránh trùng lặp
      const existingSlug = await authorService.getAuthorBySlug(slug);
      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }
      const newAuthor = await authorService.createAuthor(
        {
          name,
          slug,
          bio,
        },
        {
          fields: ["name", "slug", "bio"],
        }
      );
      return res.redirect(
        "/dashboard/authors?success=" + encodeBase64("Thêm tác giả thành công")
      );
    } catch (error) {
      return res.render("authors/add", {
        title: "Thêm tác giả",
        error: error.message,
        author: req.body,
      });
    }
  }
  static async handleUpdateAuthor(req, res) {
    const { id } = req.params;
    try {
      let { name, bio } = req.body;
      name = name.trim();
      bio = bio ? bio.trim() : "";
      let slug = generateSlug(name);
      // kiểm tra xem đã có slug chưa, nếu có thì thêm timestamp vào để tránh trùng lặp
      const author = await authorService.getAuthorById(id, {
        attributes: ["id", "slug"],
      });
      if (slug === author.slug) {
        slug = author.slug;
      }
      const isUpdateAuthor = await authorService.updateAuthorById(
        { name, bio, slug },
        author.id,
        { fields: ["slug", "name", "bio"] }
      );
      if (!isUpdateAuthor) throw new Error("Cập nhật tác giả thất bại");
      return res.redirect(
        "/dashboard/authors?success=" + encodeBase64("Cập nhật tác giả thành công")
      );
    } catch (error) {
      return res.render("authors/edit", {
        title: "Cập nhật tác giả",
        error: error.message,
        author: { id, ...req.body },
      });
    }
  }
  static async handleDeleteAuthor(req, res) {
    const { id } = req.params;
    try {

      const author = await authorService.getAuthorByIdWithBooks(id, {
        attributes: ["id", "name"],
        bookAttributes: ["id"],
      });

      if (!author) throw new Error("Tác giả không tồn tại không thể xóa");
      if (author.books && author.books.length > 0)
        throw new Error(
          "Tác giả đang có liên kết với một hoặc nhiều sách hiện không thể xóa tác giả"
        );

      const isDeleteAuthor = await authorService.deleteAuthorById(author.id);
      if (!isDeleteAuthor) throw new Error("Xóa tác giả thất bại");
      return res.redirect(
        "/dashboard/authors?success=" + encodeBase64("Xóa tác giả thành công")
      );
    } catch (error) {
      console.log(error);

      return res.redirect(`/dashboard/authors/delete/${id}?error=` + encodeBase64(error.message));
    }
  }
  static async handleSearchAuthors(req, res) {
    const { query } = req;
    try {
      const limit = query.limit || 10;
      const page = query.page || 1;
      const q = query.q || "";
      const { rows: authors, count: total } =
        await authorService.getAuthorsByName(q, { limit, page, attributes: ["id", "name", "slug"] });
      return res.json({ success: true, data: authors, total });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        message: error.message,
        data: [],
        total: 0,
      });
    }
  }
  static async renderViewAuthorForReader(req, res) {
    const { query } = req;
    const page = parseInt(req.query.page) || 1;
    try {
      const limit = parseInt(req.query.limit) || 10;
      const { rows: authors, count: totals } =
        await authorService.getAuthorsWithPagination({ ...query, limit });
      const totalPages = Math.ceil(totals / limit);
      return res.render("authors/index", {
        authors,
        totals: totalPages,
        title: "Danh sách tác giả",
        page,
        query,
      });
    } catch (error) {
      console.log("error render view author " + error.message);
      return res.render("authors/list", {
        authors: [],
        totals: 0,
        page,
        title: "Danh sách tác giả",
        error: error.message,
        query,
      });
    }
  }
}

module.exports = AuthorController;
