const http = require('node:http')
const fs = require('node:fs/promises')

const PORT = 3000

const procedures = {
  getUser: async ({ id }) => {
    return { id, name: 'Juan' }
  },
  add: async ({ a, b }) => {
    return { result: a + b }
  }
}

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
async function handleRequest(req, res) {
  // Content-length not handled for simplicity
  const { url, method, headers: requestHeaders } = req

  const writeHead = (code, ct) => res.writeHead(code, { 'Content-Type': ct })

  if (url === '/') {
    writeHead(200, 'text/html')
    const html = await fs.readFile('index.html', 'utf-8')
    res.end(html)
  } else if (url === '/rpc') {
    writeHead(200, 'application/json')
    return handleRPCRequest(req, res)
  }

  writeHead(400, 'text/plain')
  res.end('Bad Request')
}

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
async function handleRPCRequest(req, res) {
  const { method, params } = req.body

  if (!procedures[method]) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Method not found' }))
    return
  }

  procedures[method](params)
    .then(result => {
      res.writeHead(200, { 'Content-Type': 'application/json' })
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
