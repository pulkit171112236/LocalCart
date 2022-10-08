const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct)

// /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct)

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts)

// /admin/edit-product/<id> => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

// /admin/edit-product => POST
router.post('/edit-product', isAuth, adminController.postEditProduct)

// /admin/product/<productId> => DELETE
router.delete('/product/:productId', isAuth, adminController.deleteProduct)

// /admin/invoice/<orderId> => GET
router.get('/invoice/:orderId', isAuth, adminController.getInvoice)

module.exports = router
