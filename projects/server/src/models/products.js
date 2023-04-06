'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      products.hasMany(models.carts, {
        foreignKey: 'product_id'
      })
      products.hasMany(models.products_image, {
        foreignKey: 'product_id'
      })
      products.hasMany(models.products_detail, {
        foreignKey: 'product_id'
      })
      products.belongsTo(models.category, {
        foreignKey: 'category_id'
      })
      products.hasMany(models.discounts, {
        foreignKey: 'product_id'
      })
      products.hasMany(models.branch_products, {
        foreignKey: 'product_id'
      })
    }
  }
  products.init({
    products_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};