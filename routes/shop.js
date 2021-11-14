// third party
const express = require('express')

// file imports
const shopController = require('../controllers/shop')

const router = express.Router()

// Note: get and post do exact match
// router.get('/', (req, res, next) => {
//   res.send('<h1>get on root address</h1>')
// })

// /shop => GET
router.get('/', shopController.getIndex)
router.get('/products', shopController.getProducts)
router.get('/cart', shopController.getCart)
router.post('/cart', shopController.postCart)
router.get('/checkout', shopController.getCheckout)
router.get('/orders', shopController.getOrders)
router.get('/products/:productId', shopController.getProduct)

module.exports = router
