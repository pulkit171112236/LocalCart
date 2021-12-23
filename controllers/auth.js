const bcryptjs = require('bcryptjs')
const { EDESTADDRREQ } = require('constants')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { reset } = require('nodemon')

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
            from: process.env.MAIL_USER,
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

exports.getResetPassword = (req, res, next) => {
  let errorMsg = req.flash('error')
  if (errorMsg.length > 0) {
    errorMsg = errorMsg[0]
  } else errorMsg = null
  return res.render('auth/reset', {
    pageTitle: 'Reset',
    path: '/reset',
    errorMsg,
  })
}

exports.postResetPassword = (req, res, next) => {
  const email = req.body.email
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash('error', 'Email not correct')
      return res.redirect('/reset')
    }
    // create a random token
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log('__err_creating_reset_token__', err)
        return res.redirect('/')
      }
      const resetToken = buffer.toString('hex')
      user.resetToken = resetToken
      user.resetTokenExpiration = Date.now() + 360000
      user
        .save()
        .then(() => {
          res.redirect('/')
          return transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Reset Password',
            html: `
            <div>Click on <a href="${process.env.APP_BASE_URL}/reset/${resetToken}/">Link</a> to reset your localkart password.</div>
          `,
          })
        })
        .catch((err) => {
          console.log('__error_when_sending_reset_token__')
        })
    })
  })
}

exports.getChangePassword = (req, res, next) => {
  let errorMsg = req.flash('error')
  if (errorMsg.length > 0) {
    errorMsg = errorMsg[0]
  } else errorMsg = null
  const resetToken = req.params.token
  User.findOne({
    resetToken: resetToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Token not valid or token expired')
        return res.redirect('/reset')
      }
      return res.render('auth/change-password', {
        pageTitle: 'Change Password',
        path: '',
        errorMsg: errorMsg,
        userId: user._id.toString(),
        resetToken: resetToken,
      })
    })
    .catch((err) => {
      console.log('__error_while_looking_for_token_in_database__', err)
    })
}

exports.postChangePassword = (req, res, next) => {
  const { password, confirmedPassword, resetToken, userId } = req.body
  if (password !== confirmedPassword) {
    req.flash('error', 'Passwords do not match')
    return res.redirect('/reset/' + resetToken)
  }
  User.findOne({
    resetToken: resetToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Link Expired')
        return res.redirect('/reset')
      }
      bcryptjs
        .hash(password, 12)
        .then((hash) => {
          user.password = hash
          user.resetToken = undefined
          user.resetTokenExpiration = undefined
          return user.save()
        })
        .then((saveResult) => {
          return res.redirect('/login')
        })
    })
    .catch((err) => {
      console.log('__err_while_looking_token_in_db__', err)
    })
}
