const authUser = require("../middlewares/auth");
const DespesasController = require("../CONTROLLERS/DespesasController");
const User = require("../MODELS/User");
const express = require('express');
const router = express.Router();


router.get("/home", authUser, DespesasController.getDespesas, async (req, res) => {
    const userData = await User.findByPk(req.session.user.id, { raw: true, attributes: { exclude: ['password'] } });
    res.render("home", {userData});
});

module.exports = router