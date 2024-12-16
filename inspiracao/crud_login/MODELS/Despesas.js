const { DataTypes, Sequelize } = require('sequelize');
const User = require('../MODELS/User');
const db = require('../BD/conn');

const Despesas = db.define("Despesas", {
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,     
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2), // Precisão: 10 dígitos, 2 casas decimais
        allowNull: false,
    },
    tipoDePagamento: {
        type: DataTypes.STRING,
        defaultValue: "D", // D -> dinheiro, C -> crédito, P -> pix/débito
        allowNull: false,
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    categoria: {
        type: DataTypes.STRING,
        defaultValue: "diversos",
    }
});


Despesas.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE' // Remove as despesas se o usuário for deletado
});

// Permite que um User tenha várias Despesas
User.hasMany(Despesas, {
    foreignKey: 'userId'
});

module.exports = Despesas