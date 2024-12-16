const bcrypt = require('bcryptjs');

async function hashPassword(password){
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Erro ao gerar o hash da senha:", error);
    }
};

function formatarData(data) {
    const date = new Date(data); // Converte para objeto Date
    const dia = String(date.getDate()).padStart(2, '0'); // Garante dois dígitos para o dia
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Garante dois dígitos para o mês (meses começam do 0)
    const ano = date.getFullYear(); // Obtém o ano

    return `${dia}/${mes}/${ano}`; // Retorna a data no formato dd/mm/aaaa
}
module.exports = { hashPassword, formatarData }