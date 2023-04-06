'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stock_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  stock_history.init({
    product_id: DataTypes.INTEGER,
    event_type: DataTypes.STRING,
    event_date: DataTypes.DATE,
    quantity_changed: DataTypes.INTEGER,
    remaining_quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'stock_history',
  });
  return stock_history;
};