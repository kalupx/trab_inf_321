const Despesa = require('../MODELS/Despesas');
const User = require('../MODELS/User');
const { formatarData } = require("../UTILS/utils");

class DespesasController {
    static async create(req, res) {
        const { descricao, valor, data, tipoDePagamento, categoria } = req.body;
        const userLoggedId = req.session.user ? req.session.user.id : null;
        const { userId } = req.params;

        let dataFormatada = new Date(data);
    
        const offsetBrasilia = 180; 
        const dataBrasilia = new Date(dataFormatada.getTime() + offsetBrasilia * 60000);

        const novaDespesa = {
            descricao,
            valor,
            data: dataBrasilia,
            tipoDePagamento,
            categoria,
            userId,
        };



        if (userLoggedId == userId) {
            //usuario logado esta cadastrando algo pra ele
            try {
                const despesaCriada = await Despesa.create(novaDespesa);
                return res.redirect("/despesas");
            } catch {
                return res.status(500).json({ error: "Erro ao adicionar despesa" });
            }
        } else {
            return res.redirect("/despesas");
        }

    }
    static async delete(req, res){
        const depesaId = req.body.id;
        try{
            const despesaExcluida = await Despesa.findOne( {where: {id: depesaId}, raw: true} )
            if(despesaExcluida.userId === req.session.user.id){
                await Despesa.destroy({where: {id:depesaId}});
                console.log("despesa excluida com sucesso");
                return res.redirect("/despesas");
            }
        }catch(err){
            console.error(err);
        }
    }
    static async getDespesas(req, res, next){
        try {
            const userLogged = req.session.user.id;
            // const userLogged = await User.findByPk(req.session.user.id, { raw: true, attributes: { exclude: ['password'] } });
    
            const despesas = await Despesa.findAll({
                where: { userId: userLogged }, 
                raw: true
            });
            despesas.forEach((despesa) => {
                despesa.data = formatarData(despesa.data);
            })
            
            // res.render("despesas", {despesas: despesas}); 
            res.locals.despesas = despesas;
            next();
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao buscar despesas");
        }
    }
    static async updateDespesas(req, res){
        const { id, valor, data, descricao, tipoDePagamento, categoria } = req.body;
    
        let dataFormatada = new Date(data);
        
        const offsetBrasilia = 180; 
        const dataBrasilia = new Date(dataFormatada.getTime() + offsetBrasilia * 60000);

        try {
            const despesaEditada = await Despesa.update({
                descricao,
                valor,
                tipoDePagamento,
                data: dataBrasilia,  
                categoria
            }, { where: { id } });

            console.log("Despesa editada com sucesso");
            return res.redirect("/despesas");
        } catch (err) {
            console.error("Houve um erro ao editar a despesa", err);
        }
    }
}

module.exports = DespesasController