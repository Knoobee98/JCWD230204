'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions.hasMany(models.transactions_details, {
        foreignKey: 'transaction_id',
      }),
      transactions.hasMany(models.transactions_detail, {
        foreignKey: 'transaction_id',
      })
      transactions.belongsTo(models.transactions_status, {
        foreignKey: 'transaction_status_id',
      }),
      transactions.hasOne(models.transactions_log, {
        foreignKey: 'transaction_id',
      })
    }
  }
  transactions.init({
    date: DataTypes.DATE,
    expiry_date: DataTypes.DATE,
    payment_proof: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    shipping: DataTypes.STRING,
    total: DataTypes.INTEGER,
    user_id: DataTypes.STRING,
    orderId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};