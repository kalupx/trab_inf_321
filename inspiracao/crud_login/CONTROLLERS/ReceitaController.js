const Receita = require('../MODELS/Receita'); 
const { formatarData } = require('../UTILS/utils');

class ReceitaController {
    static async addReceita(req, res) {
        try {
            const { valor, data, tipo, userId } = req.body;
            // console.log("reqBody em receitas controller", req.body)
            if (!valor || !data || !tipo || !userId) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
            }
            console.log(req.session);
            if (userId != req.session.user.id) {
                console.log(`${req.session.user.id} !== ${userId}`);
                return res.status(403).json({ error: "Ação não permitida para este usuário." });
            }

            const novaReceita = await Receita.create({
                valor,
                data,
                tipo,
                userId,
            });

            // Retorna a receita criada como resposta
            req.flash("receitaAdicionada", "Receita adicionada com sucesso!");
            return res.redirect("/home");
        } catch (error) {
            console.error("Erro ao adicionar receita:", error);
            res.status(500).json({ error: "Erro interno do servidor ao adicionar receita." });
        }
    }
    
    static async getReceitas(req, res, next) {
        const userLogged = req.session.user.id;
        try{
            const receitas = await Receita.findAll({
                where: { userId: userLogged }, 
                raw: true
            });
            receitas.forEach((receita) => {
                receita.data = formatarData(receita.data);
            })

            res.locals.receitas = receitas;
            next();
        }catch (error) {
            console.error(error);
            res.status(500).send("Erro ao buscar as Receitas");
        }
    }
}

module.exports = ReceitaController;
