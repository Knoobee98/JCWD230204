'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      admin.hasOne(models.branch_store, {
        foreignKey: 'admin_id'
      }),
      admin.hasMany(models.discounts, {
        foreignKey: 'admin_id'
      })
    }
  }
  admin.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'admin',
  });
  return admin;
};