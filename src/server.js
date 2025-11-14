const http = require('node:http')
const fs = require('node:fs/promises')
const path = require('node:path')

const PORT = 3000

const procedures = {
  add: async ({ a, b }) => {
    return { result: a + b }
  }
}

let htmlContent = null
let jsContent = null
let cssContent = null

/**
 * @param {import('node:http').IncomingMessage} request
 * @param {import('node:http').ServerResponse} res
 */
async function requestHandler(request, res) {
  const { url } = request

  if (url === '/rpc') return RPCRequest(request, res)

  return staticRequest(url, res)
}

async function staticRequest(url, res) {
  if (!htmlContent || !jsContent || !cssContent) {
    htmlContent = await fs.readFile(path.join(__dirname, 'index.html'), 'utf-8')
    jsContent = await fs.readFile(path.join(__dirname, 'script.js'), 'utf-8')
    cssContent = await fs.readFile(path.join(__dirname, 'styles.css'), 'utf-8')
  }

  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    return res.end(htmlContent)
  } else if (url === '/script.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' })
    return res.end(jsContent)
  } else if (url === '/styles.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' })
    return res.end(cssContent)
  }

  res.writeHead(400, { 'Content-Type': 'text/plain' })
  return res.end('Bad Request')
}

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
async function RPCRequest(req, res) {
  let body = ''
  for await (const chunk of req) {
    body += chunk
  }
  const { method, params } = JSON.parse(body)

  if (!procedures[method]) {
    const error = { error: 'Method not found' }
    const errorLength = Buffer.byteLength(JSON.stringify(error))

    res.writeHead(404, {
      'Content-Type': 'application/json',
      'Content-Length': errorLength
    })
    return res.end(JSON.stringify({ error: 'Method not found' }))
  }

  procedures[method](params)
    .then(result => {
      const resultLength = Buffer.byteLength(JSON.stringify({ result }))
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': resultLength
      })

      return res.end(JSON.stringify({ result }))
    })
    .catch(error => {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: error.message }))
    })
}

http.createServer(requestHandler).listen(PORT, () => {
  console.log(`Client Server is listening on port ${PORT}`)
})
