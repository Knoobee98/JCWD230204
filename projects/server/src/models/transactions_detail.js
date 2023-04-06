'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions_detail.belongsTo(models.transactions, {
        foreignKey: 'transaction_id',
      })
    }
  }
  transactions_detail.init({
    product_name: DataTypes.STRING,
    qty: DataTypes.STRING,
    total_price: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transactions_detail',
  });
  return transactions_detail;
};