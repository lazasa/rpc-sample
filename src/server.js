const http = require('node:http')
const fs = require('node:fs/promises')
const path = require('node:path')

const PORT = 3000

const procedures = {
  getUser: async ({ id }) => {
    return { id, name: 'Juan' }
  },
  add: async ({ a, b }) => {
    return { result: a + b }
  }
}

let htmlContent = null
let jsContent = null

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
async function handleRequest(req, res) {
  // Content-length not handled for simplicity
  const { url, headers: requestHeaders } = req

  if (!htmlContent || !jsContent) {
    htmlContent = await fs.readFile(path.join(__dirname, 'index.html'), 'utf-8')
    jsContent = await fs.readFile(path.join(__dirname, 'script.js'), 'utf-8')
  }

  if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    return res.end(htmlContent)
  } else if (url === '/rpc') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return handleRPCRequest(req, res)
  } else if (url === '/script.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' })
    return res.end(jsContent)
  }

  res.writeHead(400, { 'Content-Type': 'text/plain' })
  res.end('Bad Request')
}

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
async function handleRPCRequest(req, res) {
  let body = ''
  for await (const chunk of req) {
    body += chunk
  }
  req.body = JSON.parse(body)
  console.log('RPC Request received', req.body)

  const { method, params } = req.body

  if (!procedures[method]) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Method not found' }))
    return
  }

  procedures[method](params)
    .then(result => {
      // res.writeHead(200, { 'Content-Type': 'application/json' })a
      console.log('RPC Call result', result)
      res.end(JSON.stringify({ result }))
    })
    .catch(error => {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: error.message }))
    })
}

http.createServer(handleRequest).listen(PORT, () => {
  console.log(`Client Server is listening on port ${PORT}`)
})
