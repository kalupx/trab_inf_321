const authUser = (req, res, next) => {
    //se tentar acessar home no brute force 
    console.log("auth user!");
    console.log(req.session.user)
    if (!req.session.user || !req.session.user.id || req.session.user.name == null) {
        console.log("estou te redirecionando!")
        return res.redirect('/');
    }

    return next(); 
}

module.exports = authUser