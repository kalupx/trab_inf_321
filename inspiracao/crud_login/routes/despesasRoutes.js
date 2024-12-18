const session = require("express-session");
const Despesas = require("../MODELS/Despesas");
const User = require("../MODELS/User");
const express = require('express');
const router = express.Router();
const authUser = require("../middlewares/auth");
const { formatarData } = require("../UTILS/utils");

router.get("/despesas", authUser, async (req, res)=>{
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
        
        console.log("User data em home: ", userLogged)
        res.render("despesas", {userData: userLogged, despesas: despesas}); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar despesas");
    }
})

router.post("/adicionar_despesa/:userId", async (req, res)=>{
    const { descricao, valor, data, tipoDePagamento, categoria } = req.body;
    const userLoggedId = req.session.user ? req.session.user.id : null;
    console.log("Usuario logado em despesas: ", userLoggedId)
    const { userId } = req.params;
    console.log(`UserId de reqparams ${userId}`);
    const novaDespesa = {
        descricao,
        valor,
        data,
        tipoDePagamento,
        categoria,
        userId, 
    };
    


    if(userLoggedId == userId){
        //usuario logado esta cadastrando algo pra ele
        try{
            const despesaCriada = await Despesas.create(novaDespesa);
            return res.redirect("/despesas");
        }catch{
            return res.status(500).json({ error: "Erro ao adicionar despesa" });
        }
    }else{
        return res.redirect("/despesas");
    }

})

router.get("/editar_despesa/:id", async (req, res)=>{
    console.log(req.params.id);
})

router.post("/excluir_despesa", async (req, res) =>{
    const depesaId = req.body.id;
    console.log(`Despesa id ${depesaId}`)
    try{
        despesaExcluida = await Despesas.findOne( {where: {id: depesaId}, raw: true} )
        if(despesaExcluida.userId === req.session.user.id){
            await Despesas.destroy({where: {id:depesaId}});
            console.log("despesa excluida com sucesso");
            return res.redirect("/despesas");
        }
    }catch(err){
        console.error(err);
    }
})
module.exports = router