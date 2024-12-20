const express = require('express');
const router = express.Router();
const User = require('../MODELS/User');
const bcrypt = require('bcryptjs');
const UserController = require("../CONTROLLERS/UsersController");

router.post("/valida_cadastro", UserController.create)
router.post("/valida_login", async (req, res) => {
    const { email_address, password } = req.body;

    try {
        const userExists = await User.findOne({ where: { email: email_address }, raw: true });
        if (userExists) {
            bcrypt.compare(password, userExists.password, (err, isMatch) => {
                if (err) {
                    console.error("Erro ao comparar a senha:", err);
                    return res.status(500).send("Erro interno do servidor");
                }

                if (isMatch) {
                    req.session.user = {id: userExists.id, name: userExists.nome};
                    req.session.save((err) => {
                        if (err) {
                            console.error("Erro ao salvar a sessão:", err);
                            return res.status(500).send("Erro interno ao salvar sessão.");
                        }
                        return res.redirect("/home");
                    });
                } else {
                    req.flash("passwordError", "A senha que você inseriu está incorreta.")
                    return res.redirect("/");
                }
            });
        } else {
            return res.redirect("/?UserExists=false"); // Redireciona se o usuário não for encontrado
        }
    } catch (error) {
        console.error("Erro ao validar login:", error);
        return res.status(500).send("Erro interno do servidor");
    }
});

router.get("/logout", (req, res)=>{
    req.session.destroy((err) => {
        if (err) {
            console.error("Erro ao destruir a sessão:", err);
            return res.status(500).send("Erro ao fazer logout.");
        }
        // Limpa o cookie da sessão (opcional)
        res.clearCookie("connect.sid"); // Nome padrão do cookie no express-session
        return res.redirect("/"); // Redireciona para a página de login
    });
});

module.exports = router