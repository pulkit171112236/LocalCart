const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then(([rows]) => {
    res.render('shop/index', {
      prods: rows,
      pageTitle: 'Shop',
      path: '/',
    })
  })
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([rows]) => {
    res.render('shop/product-list', {
      prods: rows,
      pageTitle: 'All Products',
      path: '/products',
    })
  })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId).then(([rows]) => {
    if (rows.length === 1) {
      res.render('shop/product-detail', {
        product: rows[0],
        pageTitle: 'Details',
        path: '/products',
      })
    }
  })
}

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartDetailedProducts = []
      for (let product of products) {
        const corrCartProduct = cart.products.find(
          (cprod) => cprod.id === product.id
        )
        // if current product is present is cart
        if (corrCartProduct) {
          cartDetailedProducts.push({
            productData: product,
            productQty: corrCartProduct.qty,
          })
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: cartDetailedProducts,
        totalPrice: cart.totalPrice,
      })
    })
  })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId).then(([rows]) => {
    if (rows.length === 1) {
      const product = rows[0]
      Cart.addProduct(prodId, product.price)
    }
    res.redirect('/cart')
  })
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  })
}
