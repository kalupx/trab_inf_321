const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const conn = require('./BD/conn');
const User = require('./MODELS/User');
const bcrypt = require('bcryptjs'); //hash de senhas

const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Senha criptografada:", hashedPassword);
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
        await User.create({ nome: username, email: email_address, password: hashedPassword });
        return res.render("home", { nome: username }); // Redireciona após o cadastro
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).send("Erro interno do servidor");
    }
});

// Rota para validação de login
app.post("/valida_login", async (req, res) => {
    const { email_address, password } = req.body;

    try {
        const userExists = await User.findOne({ where: { email: email_address }, raw: true });
        if (userExists) {
            console.log(userExists);
            bcrypt.compare(password, userExists.password, (err, isMatch) => {
                if (err) {
                    console.error("Erro ao comparar a senha:", err);
                    return res.status(500).send("Erro interno do servidor");
                }

                if (isMatch) {
                    console.log("Autenticado com sucesso!");
                    return res.render("home", { nome: userExists.nome });
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
    if (!req.session || !req.session.userId) {
        return res.redirect('/');
    }

    next(); //segue caso esteja autenticado
}
// Rota para a página inicial (home)
app.get("/home", authUser, (req, res) => {
    res.render('home');
});

// Rota para a página de login
app.get('/', (req, res) => {
    const passwordError = req.query.password;
    const UserExists = req.query.UserExists === "true";
    res.render('login', { passwordError, userExists: UserExists });
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
