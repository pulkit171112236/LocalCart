exports.getLogin = (req, res, next) => {
  return res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
  })
}

exports.postLogin = (req, res, next) => {
  req.session.isLogged = true
  return res.redirect('/')
}
