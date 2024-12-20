const session = require("express-session");
const Despesas = require("../MODELS/Despesas");
const DespesasController = require("../CONTROLLERS/DespesasController")
const User = require("../MODELS/User");
const express = require('express');
const router = express.Router();
const authUser = require("../middlewares/auth");

//crud de despesas
router.get("/despesas", authUser, DespesasController.getDespesas)
router.post("/adicionar_despesa/:userId", DespesasController.create)
router.post("/editar_despesa/", authUser, DespesasController.updateDespesas);
router.post("/excluir_despesa", DespesasController.delete);

module.exports = router