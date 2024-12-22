const ReceitaController = require('../CONTROLLERS/ReceitaController');
const express = require('express');
const authUser = require('../middlewares/auth');
const router = express.Router();

router.post("/adicionar_receita", ReceitaController.addReceita);

module.exports = router