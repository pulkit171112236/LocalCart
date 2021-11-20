// core-modules
const path = require('path')

// third-party-imports
const express = require('express')
const bodyParser = require('body-parser')

// file-imports
const errorController = require('./controllers/error')
const { mongoConnect } = require('./util/database')
const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.getById('61993a0327b61406b515652e').then((user) => {
    req.user = new User(user.name, user.email, user.cart, user._id.toString())
    next()
  })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

// app.use(errorController.get404)

mongoConnect((client) => {
  // console.log('client: ', client)
  // const user = new User('admin', 'admin@shop')
  // user.save().then(() => {
  //   console.log('user created!')
  // })
  app.listen(3000)
})
