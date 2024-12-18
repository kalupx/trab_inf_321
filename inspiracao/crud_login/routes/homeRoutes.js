const authUser = require("../middlewares/auth");
const Despesas = require("../MODELS/Despesas");
const User = require("../MODELS/User");
const express = require('express');
const router = express.Router();

router.get("/home", authUser, async (req, res) => {
    const userLogged = await User.findByPk(req.session.user.id, { raw: true, attributes: { exclude: ['password'] } });
    res.render("home", {userData: userLogged});
});

module.exports = router