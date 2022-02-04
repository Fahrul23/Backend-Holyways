'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        user.belongsToMany(models.fund, {
            as: "funds",
            through: {
            model: "userFund",
            as: "bridge",
            },
            foreignKey: "userId",
        });
        user.hasMany(models.userDonate, {
            as: "userDonate",
            foreignKey: {
            name: "userId",
            },
        });
    }
  };
  user.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    image: DataTypes.STRING,
    password: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};