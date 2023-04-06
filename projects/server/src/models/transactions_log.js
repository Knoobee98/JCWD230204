'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions_log.belongsTo(models.transactions, {
        foreignKey: 'transaction_id',
      }),
      transactions_log.belongsTo(models.transactions_status, {
        foreignKey: 'transaction_status_id',
      })
    }
  }
  transactions_log.init({
    datetime: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'transactions_log',
  });
  return transactions_log;
};