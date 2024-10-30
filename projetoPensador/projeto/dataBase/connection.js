const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('projeto_pensador', 'root', 'senha', {
  host: '127.0.0.1',
  port: '3306',
  dialect: 'mysql'
})

try {
  sequelize.authenticate()
  console.log('Mysql Connectado')
}catch(error){
  console.error(`Erro ao conectar: ${error}`)
}

module.exports = sequelize
