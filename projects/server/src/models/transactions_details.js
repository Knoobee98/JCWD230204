'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions_details.belongsTo(models.transactions, {
        foreignKey: 'transaction_id'
      })
      
    }
  }
  transactions_details.init({
    product_name: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    total_price: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transactions_details',
  });
  return transactions_details;
};