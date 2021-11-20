const { ObjectId } = require('mongodb')
const { getDb } = require('../util/database')
class User {
  constructor(name, email, userId = null) {
    this.name = name
    this.email = email
    this._id = userId ? ObjectId(userId) : null
  }
  save() {
    const db = getDb()
    return db
      .collection('users')
      .insertOne(this)
      .catch((err) => {
        console.log('__err_creating_user__', err)
      })
  }
  static getById(userId) {
    const db = getDb()
    return db
      .collection('users')
      .findOne({ _id: ObjectId(userId) })
      .then((user) => {
        return user
      })
      .catch((err) => {
        console.log('__error_getting_user__', err)
      })
  }
}

module.exports = User
