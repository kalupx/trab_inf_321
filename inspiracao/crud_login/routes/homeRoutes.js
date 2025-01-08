const authUser = require("../middlewares/auth");
const DespesasController = require("../CONTROLLERS/DespesasController");
const User = require("../MODELS/User");
const express = require('express');
const ReceitaController = require("../CONTROLLERS/ReceitaController");
const router = express.Router();


router.get("/home", authUser, DespesasController.getDespesas, ReceitaController.getReceitas, async (req, res) => {
    const userData = await User.findByPk(req.session.user.id, { raw: true, attributes: { exclude: ['password'] } });

    //usar flash messages!
    const isNewUser = req.query.newUser === 'True';
    res.render("home", { userData, isNewUser });
});



module.exports = router