console.log('hello')

function getConfigFor(method, params) {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method,
      params
    })
  }
}

async function addNumbers() {
  const response = await fetch('/rpc', getConfigFor('add', { a: 5, b: 3 }))

  const data = await response.json()

  console.log('RPC Response:', data)
}

const btn = document.getElementById('rpcButton')

console.log('btn', btn)
btn.addEventListener('click', () => {
  addNumbers()
})
