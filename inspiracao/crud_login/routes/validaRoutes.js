const express = require('express');
const router = express.Router();
const User = require('../MODELS/User');
const { hashPassword } = require('../UTILS/utils');
const bcrypt = require('bcryptjs');

router.post("/valida_cadastro", async (req, res) => {
    const { username, email_address, password } = req.body;
    console.log(username, email_address, password)
    try {
        let userExists = await User.findOne({ where: { nome: username }, raw: true });
        if (!userExists) {
            userExists = await User.findOne({ where: { email: email_address }, raw: true });
        }
        if (userExists) {
            console.log("Usuario ja cadastrado")
            return res.redirect('/?UserExists=true');
        }
        
        //hash
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({ nome: username, email: email_address, password: hashedPassword });
        
        req.session.user = {id: newUser.id, name: newUser.nome};
        return res.render("home", { nome: username }); // Redireciona após o cadastro
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).send("Erro interno do servidor");
    }
});

router.post("/valida_login", async (req, res) => {
    console.log("valida login")
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
                    console.log("Autenticado com sucesso!");
                    req.session.user = {id: userExists.id, name: userExists.nome};
                    return res.render("home", { nome: req.session.user.name });
                } else {
                    console.log("Senha errada, tente outra vez!");
                    return res.redirect("/?password=wrong");
                }
            });
        } else {
            console.log("Usuário não encontrado!");
            return res.redirect("/?UserExists=false"); // Redireciona se o usuário não for encontrado
        }
    } catch (error) {
        console.error("Erro ao validar login:", error);
        return res.status(500).send("Erro interno do servidor");
    }
});

router.post("/logout", (req, res)=>{
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