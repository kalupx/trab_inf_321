const User = require("../MODELS/User");
const UserController = require("../CONTROLLERS/UsersController");
const express = require('express');
const router = express.Router();
const authUser = require("../middlewares/auth");

router.get("/user_perfil", authUser, async (req, res)=>{
    const userData = await User.findByPk(req.session.user.id, { raw: true, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } });
    console.log(userData)
    res.render("user", {userData})
})

router.post("/updateUser", UserController.updateUser)

module.exports = router