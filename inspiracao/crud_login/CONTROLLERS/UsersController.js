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
                return res.redirect("/home?newUser=True");
            });
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    static async addRenda(req, res) {
        try {
            const { userIncome, userId } = req.body;
    
            if (!userIncome || !userId) {
                return res.status(400).json({ message: "Parâmetros inválidos." });
            }
    
            const user = await User.findByPk(userId);
    
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
    
            user.renda = userIncome;
            await user.save();
    
            res.redirect('/home');
        } catch (error) {
            res.redirect('/')
            // return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
    
    static async updateUser(req, res) {
        try {
            // Log para verificar os dados recebidos
            console.log("estou em user controller", req.body);
    
            // Extrair os dados da requisição
            const { username, renda, userId } = req.body;
    
            // Verificar se os campos necessários foram fornecidos
            if (!username || !userId) {
                //redirecionar pedindo nome...:?
                return res.status(400).json({ message: "Campos obrigatórios não fornecidos." });
            }
    
            const user = await User.findByPk(userId);
    
            // Verificar se o usuário existe
            if (!user) {
                //retornar erro, tirar o json
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
    
            // Atualizar os dados do usuário
            await user.update({ nome: username, renda });
            
            return res.redirect('/home')

        } catch (error) {
            // Tratar erros e retornar uma resposta de erro
            console.error("Erro ao atualizar usuário:", error);
            return res.status(500).json({ message: "Erro interno no servidor." });
        }
    }
    
}

module.exports = UserController;
