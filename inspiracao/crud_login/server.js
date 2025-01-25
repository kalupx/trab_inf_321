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
const receitasRoutes = require('./routes/receitasRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const { hashPassword } = require('./UTILS/utils');
const path = require('path');
const despesas = require('./mockDespesas.js');
const flash = require('connect-flash');
const UserController = require('./CONTROLLERS/UsersController.js')

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
app.use(express.json());

//MIDDLEWARE PARA SESSIONS, ROTAS ABAIXO DISSO!
app.use(
    session({
        secret: 'MySecret', // Substituir!!!
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 * 5 },
    })
);

//flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

//rotas de usuario
app.use(receitasRoutes);

// Rota para validação de cadastro e login
app.use(validaRoutes);

// Rota para a página inicial (home)
app.use(homeRoutes);

//rota para cadastro de despesa
app.use(despesasRoutes);

//rota para user config
app.use(userRoutes);

app.post("/add_renda", UserController.addRenda)


// Rota para a página de login
app.get('/', (req, res) => {
    res.render('login');
});


// app.get("*", (req, res)=>{
//     res.redirect('/'); //Criar pagina 404!!!
// })
// Sincroniza o banco de dados e inicia o servidor
conn.sync({force: true}).then(async () => {
    try {
        // Verifica se o usuário admin existe
        const adminExists = await User.findOne({ where: { nome: "admin" } });
        if (!adminExists) {
            const hashedPassword = await hashPassword("gN:k9!S85ogY");
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
