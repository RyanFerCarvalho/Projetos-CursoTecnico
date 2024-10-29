const { DataTypes } = require('sequelize')
const dataBase = require('../dataBase/connection')

const User = require('./User')

const Thought = dataBase.define('Thought', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    require: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true
  }
})

Thought.belongsTo(User, {foreignKey: 'user_id'})
User.hasMany(Thought, {foreignKey: 'user_id'})

module.exports = Thought
