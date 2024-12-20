const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('crud_money_care', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})

module.exports = sequelize