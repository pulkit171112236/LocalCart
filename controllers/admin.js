const pdfkit = require('pdfkit')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

const Product = require('../models/product')
const Order = require('../models/order')

const fileUtils = require('../util/file')

exports.getAddProduct = (req, res, next) => {
  let errorMsg = req.flash('error')
  if (errorMsg.length > 0) errorMsg = errorMsg[0]
  else errorMsg = null
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isAuthenticated: req.session.isLogged,
    errorMsg: errorMsg,
  })
}

// **to be fixed later
exports.postAddProduct = (req, res, next) => {
  const image = req.file
  if (!image) {
    req.flash('error', 'image-not-valid')
    return res.redirect('/admin/add-product')
  }
  const title = req.body.title
  const price = Number(req.body.price)
  const description = req.body.description
  const product = new Product({
    title,
    price,
    imageUrl: image.path,
    description,
    userId: req.user._id,
  })
  product
    .save()
    .then(() => {
      res.redirect('/products')
    })
    .catch((err) => {
      console.log('__err_saving_product__', err)
    })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId).then((product) => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/')
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      isAuthenticated: req.session.isLogged,
    })
  })
}

exports.postEditProduct = (req, res, next) => {
  // fetch all details and save
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = Number(req.body.price)
  const updatedImage = req.file
  const updatedDesc = req.body.description

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/')
      }
      product.title = updatedTitle
      if (updatedImage) {
        fileUtils.deleteFile(product.imageUrl)
        product.imageUrl = updatedImage.path
      }
      product.price = updatedPrice
      product.description = updatedDesc
      product.save().then(() => {
        res.redirect('/admin/products')
      })
    })
    .catch((err) => {
      console.log('__error_while_editing_')
      console.log(err)
    })
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId
  Product.findById(productId)
    .then((product) => {
      fileUtils.deleteFile(product.imageUrl)
      return Product.deleteOne({ _id: productId, userId: req.user._id })
    })
    .then(() => {
      res.redirect('/admin/products')
    })
}

exports.getProducts = (req, res, next) => {
  Product.find().then((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated: req.session.isLogged,
    })
  })
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params['orderId']
  const invoiceNo = orderId
  const filePath = path.join(
    __dirname,
    '..',
    'data',
    'invoice',
    invoiceNo + '.pdf'
  )
  const pdfDoc = new pdfkit()
  pdfDoc.pipe(fs.createWriteStream(filePath))
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'inline')
  pdfDoc.pipe(res)
  pdfDoc.fontSize(24).text('Invoice')
  pdfDoc.text('---------------------')
  Order.findById(orderId)
    .then((order) => {
      order.items.forEach((item) => {
        pdfDoc.text('product-id: ' + item.productId)
        pdfDoc.text('title: ' + item.details.title)
        pdfDoc.text('description: ' + item.details.description)
        pdfDoc.text('price: ' + item.details.price)
        pdfDoc.text('----------------------------------------')
      })
    })
    .then(() => {
      pdfDoc.end()
    })
}
