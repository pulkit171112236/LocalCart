const fs = require('fs')

const ROOT_PATH = require('path').dirname(require.main.filename)

const exists = (filePath) => {
  try {
    fs.statSync(filePath)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err
  })
}

module.exports = { deleteFile, exists, ROOT_PATH }
