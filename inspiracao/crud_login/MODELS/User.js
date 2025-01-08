const { DataTypes } = require('sequelize')
const db = require("../BD/conn");

const User = db.define("User", {
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    saldo:{
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
    },
    renda: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0
    }
})

module.exports = User