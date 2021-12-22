const bcryptjs = require('bcryptjs')
const { response } = require('express')

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
  User.findOne({ email: username })
    .then((user) => {
      if (user) {
        bcryptjs.compare(password, user.password).then((doMatch) => {
          console.log('compared hash')
          if (doMatch) {
            // attach the user to the session
            req.session.user = { _id: user._id }
            req.session.isLogged = true
            return req.session.save((err) => {
              if (err) {
                console.log('__error_in_saving_session__', err)
              } else {
                return res.redirect('/')
              }
            })
          } else {
            return res.redirect('/login')
          }
        })
      } else {
        console.log('called redirect')
        return res.redirect('/login')
      }
    })
    .catch((err) => {
      console.log('__error_while_login__', err)
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy()
  return res.redirect('/')
}

exports.getSignup = (req, res, next) => {
  return res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
  })
}

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email: email })
    .then((user) => {
      // if user already exists
      if (user) {
        return res.redirect('/login')
      }
      // create a hash of the password
      return bcryptjs
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({ email: email, password: hashedPassword })
          return user.save()
        })
        .then((result) => {
          return res.redirect('/login')
        })
    })
    .catch((err) => {
      console.log('__error_while_signing__', err)
    })
}
