const { STATUS_CODES } = require('http')

module.exports = {
  notFound,
  handleError,
  isIdNumber
}

function handleError (err, req, res, next) {
  if (res.headersSent) return next(err)

  if (!err.statusCode) console.error(err)
  const statusCode = err.statusCode || 500
  const errorMessage = STATUS_CODES[statusCode] || 'Internal Error'
  res.status(statusCode).json({ error: errorMessage })
}

function notFound (req, res) {
  res.status(404).json({ error: 'Not Found' })
}

function isIdNumber (req, res, next) {
  const { id } = req.params
  const toNumber = Number(id)
  const isNumber = !isNaN(toNumber)
  if (!isNumber) {
    return res.status(400).json({
      status: 400,
      success: false,
      error: 'Invalid id. Id should be a number'
    })
  }
  next()
}
