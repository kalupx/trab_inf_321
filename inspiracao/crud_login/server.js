const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const conn = require('./BD/conn');
const User = require('./MODELS/User');

// Handlebar setup
const app = express();
app.engine("handlebars", exphbs.engine());
app.set('view engine', 'handlebars');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('VIEWS/public'));

// Rota para validação de cadastro
app.post("/valida_cadastro", async (req, res) => {
    const { username, email_address, password } = req.body;

    try {
        // Verifica se o nome de usuário já está cadastrado
        let userExists = await User.findOne({ where: { nome: username }, raw: true });
        if (!userExists) {
            userExists = await User.findOne({ where: { email: email_address }, raw: true });
        }
        if (userExists) {
            console.log("Usuario ja cadastrado")
            return res.redirect('/?UserExists=true'); // Interrompe a execução se o usuário já existir
        }

        // Cria o novo usuário
        await User.create({ nome: username, email: email_address, password });
        return res.redirect("/home"); // Redireciona após o cadastro
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).send("Erro interno do servidor");
    }
});

// Rota para validação de login
app.post("/valida_login", async (req, res) => {
    const { email_address, password } = req.body;

    try {
        // Verifica se o usuário existe pelo e-mail
        const userExists = await User.findOne({ where: { email: email_address }, raw: true });
        if (userExists) {
            // Verifica se a senha está correta
            if (userExists.password === password) {
                console.log("Autenticado com sucesso!");
                return res.redirect("/home");
            } else {
                console.log("Senha errada, tente outra vez!");
                return res.redirect("/?password=wrong"); // Redireciona com erro de senha
            }
        } else {
            console.log("Usuário não encontrado!");
            return res.redirect("/?UserExists=false"); // Redireciona se o usuário não for encontrado
        }
    } catch (error) {
        console.error("Erro ao validar login:", error);
        return res.status(500).send("Erro interno do servidor");
    }
});

// Rota para a página inicial (home)
app.get("/home", (req, res) => {
    res.render('home');
});

// Rota para a página de login
app.get('/', (req, res) => {
    const passwordError = req.query.password;
    const UserExists = req.query.UserExists;
    res.render('login', { passwordError, UserExists });
});

// Sincroniza o banco de dados e inicia o servidor
conn.sync().then(async () => {
    try {
        // Verifica se o usuário admin existe
        const adminExists = await User.findOne({ where: { nome: "admin" } });
        if (!adminExists) {
            await User.create({ nome: "admin", email: "admin@admin.com", password: "1234" });
        }

        app.listen(5000, () => {
            console.log("Servidor rodando na porta 5000");
        });
    } catch (err) {
        console.error("Erro ao inicializar o banco de dados:", err);
    }
}).catch((err) => {
    console.error("Houve um erro ao criar o BD:", err);
});
