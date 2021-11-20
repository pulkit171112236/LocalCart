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
  User.getById('61989da09d62b6224f879941').then((user) => {
    req.user = new User(user.name, user.email, user.cart, user._id.toString())
    next()
  })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

// app.use(errorController.get404)

mongoConnect((client) => {
  // console.log('client: ', client)
  // const user = new User('admin', 'admin@mongodb')
  // user.save().then(() => {
  //   console.log('user created!')
  // })
  app.listen(3000)
})
