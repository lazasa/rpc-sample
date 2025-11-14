const $ = document.querySelector.bind(document)

function RPC(method, params) {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      method,
      params
    })
  }
}

async function ADD({ a, b }) {
  const response = await fetch('/rpc', RPC('add', { a, b }))

  const data = await response.json()

  return data
}

const CALCULATOR = {
  ADD
}

const btn = $('#rpcButton')
btn.addEventListener('click', async () => {
  const sum1 = Number($('#sum1').value)
  const sum2 = Number($('#sum2').value)
  if (!sum1 || !sum2) return

  const response = await CALCULATOR.ADD({ a: sum1, b: sum2 })
  const resultNode = $('#resultValue')
  resultNode.textContent = JSON.stringify(response.result, null, 2)
})
