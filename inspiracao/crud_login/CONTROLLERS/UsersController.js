const { Op } = require("sequelize");
const User = require("../MODELS/User");
const { hashPassword } = require('../UTILS/utils');

class UserController {
    static async create(req, res) {
        const { email_address, username, password } = req.body;
        const name = username; //gambiarra
        if (!email_address || !name || !password) {
            req.flash('error', 'Todos os campos são obrigatórios (email, nome e senha).');
            return res.redirect('/');
        }
        
        try {
            // Verifica se o e-mail ou o nome já estão cadastrados
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [
                        { email: email_address },
                        { nome: name }
                    ]
                }
            });

            if (existingUser) {
                req.flash('userExists', 'Usuário já cadastrado, tente novamente!');
                console.log("User exists!")
                return res.redirect('/');
            }

            const hashedPassword = await hashPassword(password);

            const newUser = await User.create({
                nome: name,
                email: email_address,
                password: hashedPassword
            });
            req.session.user = {id: newUser.id, name: newUser.nome};
            req.session.save((err) => {
                if (err) {
                    console.error("Erro ao salvar a sessão:", err);
                    return res.status(500).send("Erro interno ao salvar sessão.");
                }
                req.flash('newUser', newUser.nome);
                console.log("req.flash em user controller", req.flash('newUser'));   
                return res.redirect("/home?newUser=True");
            });
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}

module.exports = UserController;
