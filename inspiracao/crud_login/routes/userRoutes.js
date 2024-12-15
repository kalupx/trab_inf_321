const express = require('express');
const router = express.Router();
const User = require('../MODELS/User'); 
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll(); 
        res.render('users', { users }); //definir users
    } catch (error) {
        res.status(500).send('Erro ao buscar usuários');
    }
});

router.post('/add', async (req, res) => {
    const { name, email } = req.body;
    try {
        await User.create({ name, email });
        res.redirect('/users');
    } catch (error) {
        res.status(500).send('Erro ao adicionar usuário');
    }
});

module.exports = router;
