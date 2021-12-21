const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  return res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
  })
}

exports.postLogin = (req, res, next) => {
  // validate the admin username and password and attach to session
  const { username, password } = req.body
  if (
    username == process.env.ADMIN_USERNAME ||
    password == process.env.ADMIN_PASSWORD
  ) {
    User.findById('619a034d711c3966da0c05b2').then((user) => {
      req.session.user = { _id: user._id }
      req.session.isLogged = true
      return res.redirect('/')
    })
  } else return res.redirect('/')
}

exports.getLogout = (req, res, next) => {
  req.session.destroy()
  return res.redirect('/')
}
