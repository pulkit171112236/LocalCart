// core-modules
const path = require('path')
const fs = require('fs')

// third-party-imports
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const MongoDbStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const multer = require('multer')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

// file-imports
const errorController = require('./controllers/error')
const User = require('./models/user')
const { ROOT_PATH } = require('./util/file')

// constants
const MONGODB_URI = process.env.MONGODB_URI_SERVER

// required objects
const app = express()
const mongodbStore = MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions',
})
const uploadedFileStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname)
  },
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
})
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
const accessLogStream = fs.createWriteStream(
  path.join(ROOT_PATH, 'access.log'),
  { flags: 'a' }
)

// set view-engine
app.set('view engine', 'ejs')
app.set('views', 'views')

// Routes
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

// securing headers
app.use(helmet())
// using compression
app.use(compression())
app.use(
  morgan('combined', {
    stream: accessLogStream,
  })
)

// middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  multer({ storage: uploadedFileStorage, fileFilter: fileFilter }).single(
    'image'
  )
)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(
  session({
    secret: 'a long string as secret',
    resave: false,
    saveUninitialized: false,
    store: mongodbStore,
  })
)
app.use(flash())
app.use(csrf())

// attaching csrfToken and isAuthenticated to response so they are available to all views which renders
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  res.locals.isAuthenticated = req.session.isLogged
  next()
})

app.use((req, res, next) => {
  if (!req.session.user) {
    next()
  } else {
    User.findById(req.session.user._id).then((user) => {
      req.user = user
      next()
    })
  }
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorController.get404)

const PORT = process.env.PORT || 3000
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log('Connected!')
    app.listen(PORT)
  })
  .catch((err) => {
    console.log('client_not_connected', err)
  })
