const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const conn = require('./BD/conn');
const User = require('./MODELS/User');
const Despesas = require("./MODELS/Despesas");
const session = require('express-session');
const validaRoutes = require('./routes/validaRoutes');
const homeRoutes = require('./routes/homeRoutes');
const despesasRoutes = require('./routes/despesasRoutes');
const { hashPassword } = require('./UTILS/utils');
const path = require('path');
const despesas = [
    {
        descricao: "Compra de material de escritório",
        valor: 200.50,
        tipoDePagamento: "Dinheiro", 
        data: new Date(),
        userId: 1
    },
    {
        descricao: "Aluguel do mês",
        valor: 1500.00,
        tipoDePagamento: "Pix/Débito",  
        data: new Date(),
        userId: 1
    },
    {
        descricao: "Compra de café",
        valor: 50.00,
        tipoDePagamento: "Crédito", 
        data: new Date(),
        userId: 1
    },
    {
        descricao: "Internet e telefone",
        valor: 300.00,
        tipoDePagamento: "Pix/Débito",
        data: new Date(),
        userId: 1
    },
    {
        descricao: "Manutenção de computador",
        valor: 400.75,
        tipoDePagamento: "Dinheiro", 
        data: new Date(),
        userId: 1
    }
]; //mock de despesas


// Handlebar setup
const app = express();
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'VIEWS'));

const hbs = exphbs.create({
    helpers: {
        json: function (context) {
            return JSON.stringify(context);
        }
    },
    partialsDir: path.join(__dirname, 'VIEWS', 'partials')
});
app.engine('handlebars', hbs.engine);
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
        cookie: { maxAge: 60000 * 5 },
    })
);


// Rota para validação de cadastro
app.use(validaRoutes);

// Rota para a página inicial (home)
app.use(homeRoutes);

//rota para cadastro de despesa
app.use(despesasRoutes);

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
            const admin = await User.create({ nome: "admin", email: "admin@admin.com", password: hashedPassword });
            
            // Cria as despesas no banco de dados
            await Promise.all(
                despesas.map(async (despesa) => {
                    await Despesas.create(despesa);
                })
            );
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
