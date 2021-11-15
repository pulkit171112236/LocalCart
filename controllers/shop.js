const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    })
  })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId, (product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: 'Details',
      path: '/products',
    })
  })
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    })
  })
}

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    const detailedProducts = [...cart.products]
    const totalPrice = cart.totalPrice
    const addProductProps = (i, cb) => {
      console.log('adding props for i:', i)
      if (i < detailedProducts.length) {
        Product.findById(detailedProducts[i].id, (product) => {
          if (product) {
            detailedProducts[i] = { ...detailedProducts[i], ...product }
          }
          addProductProps(i + 1, cb)
        })
      } else {
        console.log('callback function')
        cb()
      }
    }
    addProductProps(0, () => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: detailedProducts,
        totalPrice: totalPrice,
      })
    })
  })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price)
  })
  res.redirect('/cart')
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
