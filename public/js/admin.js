const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector('[name=productId]').value
  const csrfTok = btn.parentNode.querySelector('[name=_csrf]').value
  const productElement = btn.closest('article')
  window.p = productElement
  console.log('prodId', prodId)
  console.log('csrftok,', csrfTok)

  fetch('/admin/product/' + prodId, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrfTok,
    },
  })
    .then((result) => {
      return result.json()
    })
    .then((data) => {
      if (data.message === 'SUCCESS') {
        productElement.parentNode.removeChild(productElement)
      }
    })
    .catch((err) => console.log(err))
}
