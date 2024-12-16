const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const conn = require('./BD/conn');
const User = require('./MODELS/User');
const bcrypt = require('bcryptjs'); //hash de senhas
const session = require('express-session');

const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Erro ao gerar o hash da senha:", error);
    }
};

// Handlebar setup
const app = express();
app.engine("handlebars", exphbs.engine());
app.set('view engine', 'handlebars');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('VIEWS/public'));

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
app.post("/valida_cadastro", async (req, res) => {
    const { username, email_address, password } = req.body;

    try {
        let userExists = await User.findOne({ where: { nome: username }, raw: true });
        if (!userExists) {
            userExists = await User.findOne({ where: { email: email_address }, raw: true });
        }
        if (userExists) {
            console.log("Usuario ja cadastrado")
            return res.render('/?UserExists=true');
        }
        
        //hash
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({ nome: username, email: email_address, password: hashedPassword });
        
        req.session.user = {id: newUser.id, name: newUser.nome};
        return res.render("home", { nome: username }); // Redireciona após o cadastro
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).send("Erro interno do servidor");
    }
});

// Rota para validação de login
app.post("/valida_login", async (req, res) => {
    console.log("valida login")
    console.log(req.session.user)
    const { email_address, password } = req.body;

    try {
        const userExists = await User.findOne({ where: { email: email_address }, raw: true });
        if (userExists) {
            bcrypt.compare(password, userExists.password, (err, isMatch) => {
                if (err) {
                    console.error("Erro ao comparar a senha:", err);
                    return res.status(500).send("Erro interno do servidor");
                }

                if (isMatch) {
                    console.log("Autenticado com sucesso!");
                    req.session.user = {id: userExists.id, name: userExists.nome};
                    return res.render("home", { nome: req.session.user.name });
                } else {
                    console.log("Senha errada, tente outra vez!");
                    return res.redirect("/?password=wrong");
                }
            });
        } else {
            console.log("Usuário não encontrado!");
            return res.redirect("/?UserExists=false"); // Redireciona se o usuário não for encontrado
        }
    } catch (error) {
        console.error("Erro ao validar login:", error);
        return res.status(500).send("Erro interno do servidor");
    }
});

const authUser = (req, res, next) => {
    //se tentar acessar home no brute force 
    console.log("auth user!");
    console.log(req.session.user)
    if (!req.session.user.id || req.session.user.name == null) {
        console.log("estou te redirecionando!")
        return res.redirect('/');
    }

    return next(); 
}
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
