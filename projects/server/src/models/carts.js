'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      carts.belongsTo(models.users, {
        foreignKey: 'user_id',
      }),
      carts.belongsTo(models.products, {
        foreignKey: 'product_id',
      })
    }
  }
  carts.init({
    qty: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'carts',
  });
  return carts;
};