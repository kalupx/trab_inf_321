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
module.exports = { hashPassword }