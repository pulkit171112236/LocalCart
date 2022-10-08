const path = require('path')
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const s3 = new S3({
  endpoint: process.env.B2_ENDPOINT_URL,
  accessKeyId: process.env.B2_KEY_ID,
  secretAccessKey: process.env.B2_APPLICATION_KEY,
  signatureVersion: 'v4',
})

// uploads a file to B2
module.exports.uploadFile = (fileKey, localFilePath) => {
  const fileStream = fs.createReadStream(localFilePath)
  return s3
    .upload({
      Key: fileKey,
      Bucket: process.env.B2_BUCKET_NAME,
      Body: fileStream,
    })
    .promise()
    .then((result) => {
      console.log('File uploaded to B2...\n', result)
      return result
    })
    .catch((err) => {
      console.log('Error while uploading file to B2\n', err)
      return null
    })
}

// fetch file-buffer from B2 storage
module.exports.fetchFileBuffer = (fileKey) => {
  return s3
    .getObject({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: fileKey,
    })
    .promise()
    .then((result) => {
      return result.Body
    })
    .catch((err) => {
      console.log('Error while getting object from B2!\n', err)
      return null
    })
}

// fetch and download a file from B2 to local storage
module.exports.fetchFileToLocal = (fileKey, localBaseFolder) => {
  return s3
    .getObject({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: fileKey,
    })
    .promise()
    .then((result) => {
      console.log('File fetched from B2...\n', result)
      const filePath = path.join(localBaseFolder, fileKey)
      const dirPath = path.dirname(filePath)
      fs.mkdirSync(dirPath, { recursive: true })
      fs.promises.writeFile(filePath, result.Body).then(() => {
        console.log(`File ${filePath} is written to local storage...`)
      })
      return result.Body
    })
    .catch((err) => {
      console.log('Error while getting object from B2!\n', err)
      return null
    })
}

// get filestream for downloading from b2
module.exports.getFileStream = async (fileKey) => {
  try {
    const params = {
      Key: fileKey,
      Bucket: process.env.B2_BUCKET_NAME,
    }
    await s3.headObject(params).promise()
    return s3.getObject(params).createReadStream()
  } catch (err) {
    console.log('Error while creating read-stream!\n', err)
    return null
  }
}

module.exports.deleteFile = (fileKey) => {
  return s3
    .deleteObject({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: fileKey,
    })
    .promise()
    .then((result) => {
      console.log('Delete from B2 result:', result)
    })
    .catch((err) => {
      console.log('Error while deleting object!\n', err)
      return null
    })
}
