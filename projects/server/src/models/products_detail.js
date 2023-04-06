'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      products_detail.belongsTo(models.products, {
        foreignKey: "product_id",
      })
    }
  }
  products_detail.init({
    desc: DataTypes.TEXT,
    price: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'products_detail',
  });
  return products_detail;
};