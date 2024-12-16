const authUser = (req, res, next) => {
    //se tentar acessar home no brute force
    if (!req.session.user || !req.session.user.id || req.session.user.name == null) {
        return res.redirect('/');
    }

    return next(); 
}

module.exports = authUser