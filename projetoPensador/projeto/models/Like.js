const { DataTypes } = require('sequelize')
const dataBase = require('../dataBase/connection')

const User = require('./User')
const Thought = require('./Thought')

const Like = dataBase.define('Like', {
  id: {
    primaryKey: true,
    allowNull: false,
    require: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  }
})

Like.belongsTo(User, { foreignKey: 'userId' })
Like.belongsTo(Thought, { foreignKey: 'thoughtId' })

User.hasMany(Like, { foreignKey: 'userId' })
Thought.hasMany(Like, { foreignKey: 'thoughtId' })

module.exports = Like
