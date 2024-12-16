const session = require("express-session");
const Despesas = require("../MODELS/Despesas");
const User = require("../MODELS/User");
const express = require('express');
const router = express.Router();


router.post("/adicionar_despesa/:id", async (req, res)=>{
    const { descricao, valor, data, tipoDePagamento, categoria } = req.body;
    const userLoggedId = req.session.user ? req.session.user.id : null;
    console.log("Usuario logado em despesas: ", userLoggedId)
    const { id } = req.params;
    const novaDespesa = {
        descricao,
        valor,
        data,
        tipoDePagamento,
        categoria,
        userId: id, 
    };
    


    if(userLoggedId == id){
        //usuario logado esta cadastrando algo pra ele
        try{
            const despesaCriada = await Despesas.create(novaDespesa);
            return res.redirect("/home");
        }catch{
            return res.status(500).json({ error: "Erro ao adicionar despesa" });
        }
    }else{
        return res.redirect('/')
    }

})

module.exports = router