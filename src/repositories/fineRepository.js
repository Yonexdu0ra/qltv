const { Fine, Borrow, BorrowDetail, User, Book } = require("../models");

class FineRepository {
  static findAll(query, options = {}) {
    return Fine.findAll({
      where: query,
      ...options
    })
  }
  static findOne(query, options = {}) {
    return Fine.findOne({
      where: query,
      ...options
    })
  }
  static findOneWithBorrowDetailAndBorrowerAndBook(query, options = {}) {
    return Fine.findOne({
      where: query,
      ...options,
      include: [
        {
          model: BorrowDetail,
          as: 'borrowDetail',
          attributes: options.borrowDetailAttributes,
          where: options.borrowDetailWhere,
          include: [
            {
              model: Borrow,
              as: 'borrow',
              attributes: options.borrowAttributes,
              where: options.borrowWhere,
              include: [
                {
                  model: User,
                  as: 'borrower',
                  attributes: options.borrowerAttributes,
                  where: options.borrowerWhere
                }
              ]
            },
            {
              model: Book,
              as: 'book',
              attributes: options.bookAttributes,
              where: options.bookWhere
            }
          ]
        }
      ]
    })
  }
  static findAllAndCount(query, options = {}) {
    return Fine.findAndCountAll({
      where: query,
      ...options
    })
  }


  static findAllWithBorrowDetailAndBorrowerAndBookPagination(query, options = {}) {
     return Fine.findAndCountAll({
      where: {...query},
      ...options,
      include: [
        {
          required: true,
          model: BorrowDetail,
          as: 'borrowDetail',
          attributes: options.borrowDetailAttributes,
          where: options.borrowDetailWhere,
          include: [
            {

              model: Borrow,
              as: 'borrow',
              required: true,
              attributes: options.borrowAttributes,
              where: options.borrowWhere,
              include: [
                {
                  required: true,
                  model: User,
                  as: 'borrower',
                  attributes: options.borrowerAttributes,
                  where: options.borrowerWhere
                }
              ]
            },
            {
              required: true,
              model: Book,
              as: 'book',
              attributes: options.bookAttributes,
              where: options.bookWhere
            }
          ]
        }
      ]
    })
    
  }
  static findByPk(id, options = {}) {
    return Fine.findByPk(id, options);
  }
  static count(query, options = {}) {
    return Fine.count({
      where: query,
      ...options
    });
  }
  static create(data, options = {}) {
    return Fine.create(data, options);
  }
  static createMany(dataArray, options = {}) {
    return Fine.bulkCreate(dataArray, options);
  }
  static update(data, query, options = {}) {
    return Fine.update(data, { where: query, ...options });
  }
  static delete(query, options = {}) {
    return Fine.destroy({ where: query, ...options });
  }
  static sum(field, query, options = {}) {
    return Fine.sum(field, { where: query, ...options });
  }

}

module.exports = FineRepository;
