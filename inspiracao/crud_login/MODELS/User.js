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
    }
})

module.exports = User