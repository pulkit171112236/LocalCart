exports.getLogin = (req, res, next) => {
  return res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
  })
}
