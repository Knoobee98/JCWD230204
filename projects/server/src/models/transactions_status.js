'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions_status.hasMany(models.transactions, {
        foreignKey: 'transaction_status_id',
      }),
      transactions_status.hasMany(models.transactions_log, {
        foreignKey: 'transaction_status_id',
      })
    }
  }
  transactions_status.init({
    status_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transactions_status',
  });
  return transactions_status;
};