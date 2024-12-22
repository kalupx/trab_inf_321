const { DataTypes } = require('sequelize')
const db = require("../BD/conn");
const User = require('./User');

const Receita = db.define('Receita', {
    valor: {
        type: DataTypes.FLOAT, 
        allowNull: false,
        validate: {
            isFloat: true, 
            min: 0        
        }
    },
    data: {
        type: DataTypes.DATEONLY, 
        allowNull: false,
        validate: {
            isDate: true 
        }
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 50] 
        }
    }
}, {
    tableName: 'receitas', 
    timestamps: true       
});

Receita.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE' // Remove as Receita se o usuário for deletado
});

// Permite que um User tenha várias Receita
User.hasMany(Receita, {
    foreignKey: 'userId'
});

module.exports = Receita