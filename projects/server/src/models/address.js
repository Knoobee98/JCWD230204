'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      address.belongsTo(models.users, {
        foreignKey: 'user_id',
      })
    }
  }
  address.init({
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    longitude: DataTypes.STRING,
    latitude: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'address',
  });
  return address;
};