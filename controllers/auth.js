const bcryptjs = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const User = require('../models/user')

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API,
    },
  })
)

exports.getLogin = (req, res, next) => {
  let errorMsg = req.flash('error')
  if (errorMsg.length > 0) {
    errorMsg = errorMsg[0]
  } else errorMsg = null
  return res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMsg,
  })
}

exports.postLogin = (req, res, next) => {
  // validate the admin username and password and attach to session
  const { username, password } = req.body
  User.findOne({ email: username })
    .then((user) => {
      if (user) {
        bcryptjs.compare(password, user.password).then((doMatch) => {
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
            req.flash('error', 'Invalid password')
            return res.redirect('/login')
          }
        })
      } else {
        req.flash('error', 'Username not registered')
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
  let errorMsg = req.flash('error')
  if (errorMsg.length > 0) {
    errorMsg = errorMsg[0]
  } else errorMsg = null
  return res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMsg,
  })
}

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email: email })
    .then((user) => {
      // if user already exists
      if (user) {
        req.flash('error', 'E-mail exists! pick a different one.')
        return res.redirect('/signup')
      }
      // create a hash of the password
      return bcryptjs
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({ email: email, password: hashedPassword })
          return user.save()
        })
        .then((result) => {
          res.redirect('/login')
          return transporter.sendMail({
            from: 'pulkit171112236@gmail.com',
            to: email,
            subject: 'Signup',
            html: '<h1>Signup Succeeded</h1>',
          })
        })
        .catch((err) => {
          console.log('error while sending mail')
        })
    })
    .catch((err) => {
      console.log('__error_while_signing__', err)
    })
}
