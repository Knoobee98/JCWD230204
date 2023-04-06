'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class discount_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  discount_category.init({
    discount_name: DataTypes.STRING,
    discount_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'discount_category',
  });
  return discount_category;
};