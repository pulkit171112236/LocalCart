const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db
const mongoConnect = (callBack) => {
  MongoClient.connect(
    'mongodb+srv://pulkit:5tEvPesz6qA3izWh@cluster0.qgwii.mongodb.net/shop?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Connected!')
      _db = client.db()
      callBack(client)
    })
    .catch((err) => {
      console.log('__error_connecting_mongo_client__', err)
    })
}

const getDb = () => {
  if (_db) {
    return _db
  } else {
    throw '__error_no_database_found__'
  }
}

module.exports = { getDb, mongoConnect }
