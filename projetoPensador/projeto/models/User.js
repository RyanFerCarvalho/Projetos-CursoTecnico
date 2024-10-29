const { DataTypes } = require('sequelize')
const dataBase = require('../dataBase/connection')

const User = dataBase.define('User', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    require: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true
  },
})

module.exports = User
