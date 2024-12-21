const session = require("express-session");
const Despesas = require("../MODELS/Despesas");
const DespesasController = require("../CONTROLLERS/DespesasController")
const User = require("../MODELS/User");
const express = require('express');
const router = express.Router();
const authUser = require("../middlewares/auth");

//crud de despesas
router.get("/despesas", authUser, DespesasController.getDespesas, async (req, res)=>{
    const userData = await User.findByPk(req.session.user.id, { raw: true, attributes: { exclude: ['password'] } });
    res.render("despesas", {userData})
})
router.post("/adicionar_despesa/:userId", DespesasController.create)
router.post("/editar_despesa/", authUser, DespesasController.updateDespesas);
router.post("/excluir_despesa", DespesasController.delete);

module.exports = router