const Product = require('../models/product')
const Cart = require('../models/cart')
const CartItem = require('../models/cart-item')
const Order = require('../models/order')
const OrderItem = require('../models/order-item')

exports.getIndex = (req, res, next) => {
  const user = req.user
  user.getProducts().then((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    })
  })
}

exports.getProducts = (req, res, next) => {
  const user = req.user
  user.getProducts().then((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    })
  })
}

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId
  const user = req.user
  user.getProducts({ where: { id: prodId } }).then((product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: 'Details',
      path: '/products',
    })
  })
}

exports.getCart = (req, res, next) => {
  const user = req.user
  user.getCart().then((cart) => {
    cart.getProducts().then((products) => {
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        cart: products,
        totalPrice: 0,
      })
    })
  })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId
  const user = req.user
  let fetchedCart
  user
    .getCart()
    .then((cart) => {
      fetchedCart = cart
      return cart.getProducts({
        where: { id: prodId },
      })
    })
    .then((cartProducts) => {
      if (cartProducts.length > 0) {
        // already has
        const cartProduct = cartProducts[0]
        return fetchedCart.addProduct(cartProduct, {
          through: { quantity: cartProduct.cartItem.quantity + 1 },
        })
      } else {
        return Product.findByPk(prodId).then((product) => {
          return fetchedCart.addProduct(product, { through: { quantity: 1 } })
        })
      }
    })
    .then(() => {
      return res.redirect('/cart')
    })
}

exports.postDeleteFromCart = (req, res, next) => {
  const productId = req.body.productId
  const user = req.user
  user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } })
    })
    .then((cartProducts) => {
      const cartProduct = cartProducts[0]
      return cartProduct.cartItem.destroy()
    })
    .then(() => {
      return res.redirect('/cart')
    })
    .catch((err) => {
      console.log('__error_deleting_from_cart__', err)
    })
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      console.log(orders[0])
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        totalPrice: 0,
      })
    })
    .catch((err) => {
      console.log('__error_getting_order__', err)
    })
}

exports.postOrder = (req, res, next) => {
  let fetchedProducts
  let fetchedCart
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then((products) => {
      fetchedProducts = products
      return req.user.createOrder()
    })
    .then((order) => {
      return order.addProducts(
        fetchedProducts.map((product) => {
          product.orderItem = { quantity: product.cartItem.quantity }
          return product
        })
      )
    })
    .then(() => {
      return fetchedCart.setProducts(null)
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch((err) => {
      console.log('__error_creating_order__', err)
    })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  })
}
