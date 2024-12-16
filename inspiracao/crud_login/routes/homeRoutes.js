const authUser = require("../middlewares/auth");
const Despesas = require("../MODELS/Despesas");
const User = require("../MODELS/User");
const express = require('express');
const router = express.Router()
const { formatarData } = require("../UTILS/utils")

router.get("/home", authUser, async (req, res) => {
    try {
        const userLogged = await User.findByPk(req.session.user.id, { raw: true, attributes: { exclude: ['password'] } });

        const despesas = await Despesas.findAll({
            where: { userId: userLogged.id }, 
            raw: true
        });
        despesas.forEach((despesa) => {
            switch(despesa.tipoDePagamento) {
                case 'D':
                    despesa.tipoDePagamento = 'Dinheiro';
                    break;
                case 'C':
                    despesa.tipoDePagamento = 'Crédito';
                    break;
                case 'P':
                    despesa.tipoDePagamento = 'Pix/Débito';
                    break;
                default:
                    despesa.tipoDePagamento = 'Desconhecido';
            }
            despesa.data = formatarData(despesa.data);
        })
        // console.log(`despesas: `, despesas)
        // console.log(`UserLogged: `, userLogged)
        
        res.render("home", {userData: userLogged, despesas: despesas}); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar despesas");
    }
});

module.exports = router