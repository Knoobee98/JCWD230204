'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class branch_store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      branch_store.belongsTo(models.admin, {
        foreignKey: 'admin_id'
      }),
      branch_store.hasMany(models.branch_products, {
        foreignKey: 'branch_id',
      })
    }
  }
  branch_store.init({
    branch_name: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    longitude: DataTypes.STRING,
    latitude: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'branch_store',
  });
  return branch_store;
};