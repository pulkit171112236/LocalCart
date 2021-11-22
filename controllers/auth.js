exports.getLogin = (req, res, next) => {
  return res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
  })
}

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'isLogged=true')
  return res.redirect('/')
}
