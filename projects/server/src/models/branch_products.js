'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class branch_products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      branch_products.belongsTo(models.branch_store, {
        foreignKey: 'branch_id'
      }),
      branch_products.belongsTo(models.products, {
        foreignKey: 'product_id',
      })
    }
  }
  branch_products.init({
    stock: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'branch_products',
  });
  return branch_products;
};