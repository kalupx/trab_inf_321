const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const conn = require('./BD/conn');
const User = require('./MODELS/User');
const session = require('express-session');
const validaRoutes = require('./routes/validaRoutes');
const { hashPassword } = require('./UTILS/utils')
const authUser = require("./middlewares/auth")
// Handlebar setup
const app = express();
app.engine("handlebars", exphbs.engine());
app.set('view engine', 'handlebars');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('VIEWS/public'));
app.use(express.json())

//MIDDLEWARE PARA SESSIONS, ROTAS ABAIXO DISSO!
app.use(
    session({
        secret: 'MySecret', // Substituir!!!
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 },
    })
);


// Rota para validação de cadastro
app.use(validaRoutes);

// Rota para a página inicial (home)
app.get("/home", authUser, (req, res) => {
    res.render('home', {nome: req.session.user ? req.session.user.name : null});
});

// Rota para a página de login
app.get('/', (req, res) => {
    const passwordError = req.query.password;
    const UserExists = req.query.UserExists === "true";
    res.render('login', { passwordError, userExists: UserExists });
});

// Sincroniza o banco de dados e inicia o servidor
conn.sync({force: true}).then(async () => {
    try {
        // Verifica se o usuário admin existe
        const adminExists = await User.findOne({ where: { nome: "admin" } });
        if (!adminExists) {
            const hashedPassword = await hashPassword("1234");
            await User.create({ nome: "admin", email: "admin@admin.com", password: hashedPassword });
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
