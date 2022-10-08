const fs = require('fs')
const path = require('path')

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

// delete file stored locally
// will not break response if any error arises
const deleteFile = (filePath) => {
  console.log(`Deleting local file ${filePath}...`)
  if (fs.existsSync(filePath)) {
    return fs.unlink(filePath, (err) => {
      if (err) {
        console.log('Error while deleting!\n', err)
      }
    })
  } else {
    console.log('File do not exists!')
    return null
  }
}

const writeToLocal = (filePath, buffer) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  return fs.promises.writeFile(filePath, buffer).then(() => {
    console.log(`File ${filePath} is written to local storage...`)
  })
}

module.exports = { deleteFile, exists, ROOT_PATH, writeToLocal }
