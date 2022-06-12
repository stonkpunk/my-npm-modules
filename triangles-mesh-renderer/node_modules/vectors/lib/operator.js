module.exports = operator

function operator(name, op) {
  return function generator(dims, opts) {
    dims = +dims|0
    opts = opts || {}

    var scalars = 'scalars' in opts
      ? opts.scalars : true
    var vectors = 'vectors' in opts
      ? opts.vectors : true

    var both = scalars && vectors
    var body = []

    if (!scalars && !vectors) throw new Error(
      'Your function must accept either scalars or vectors'
    )

    body.push('return function ' + name + dims + '(vec) {')
      body.push('var i = arguments.length')
      body.push('while (--i) {')
        if (both) body.push('if (Array.isArray(arguments[i])) {')
        if (vectors) {
          for (var i = 0; i < dims; i += 1) {
            body.push('vec[' + i + '] ' + op + '= arguments[i][' + i + ']')
          }
        }
        if (both) body.push('} else {')
        if (scalars) {
          for (var i = 0; i < dims; i += 1) {
            body.push('vec[' + i + '] ' + op + '= arguments[i]')
          }
        }
        if (both) body.push('}')
      body.push('}')
      body.push('return vec')
    body.push('}')

    return Function(body.join('\n'))()
  }
}
