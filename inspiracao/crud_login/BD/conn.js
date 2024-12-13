const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('crud_money_care', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize