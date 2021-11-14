// core packages
// const http = require('http') //not required as already included in express
const path = require('path')

// third party packages
const express = require('express')
const bodyParser = require('body-parser')

// file imports
const rootDir = require('./utils/path')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require('./controllers/error')

const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views')

// middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, 'public')))

// Note: all routes in admin-routes are prefixed with /admin
app.use('/admin', adminRoutes)
app.use(shopRoutes)

// Note: default path is '/'
app.use(errorController.get404)

app.listen(3000)
