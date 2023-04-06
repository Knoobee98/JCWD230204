'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users.hasMany(models.carts, {
        foreignKey: 'user_id',
      }),
      users.hasMany(models.address, {
        foreignKey: 'user_id',
      }),
      users.hasOne(models.profiles, {
        foreignKey: 'user_id',
      })
    }
  }
  users.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};