# RPC Sample Project

A simple demonstration of Remote Procedure Call (RPC) implementation using vanilla JavaScript and Node.js HTTP server.

## Overview

This project showcases a minimal RPC architecture where a client-side web application communicates with a server using JSON-RPC-style requests. The example implements a basic calculator that performs addition operations through RPC calls.

## Features

- **Pure Node.js HTTP Server**: No external frameworks - uses native Node.js `http` module
- **JSON-RPC Pattern**: Client-server communication using a custom RPC protocol
- **Static File Serving**: Server handles HTML, CSS, and JavaScript file delivery with in-memory caching
- **Interactive UI**: Simple calculator interface to demonstrate RPC calls in action

## Project Structure

```
src/
├── index.html   # Client-side UI
├── script.js    # Client-side RPC logic
├── server.js    # Node.js HTTP server with RPC endpoint
└── styles.css   # UI styling
```

## How It Works

### Server Side (`server.js`)

The server exposes two types of endpoints:

1. **Static Routes** (`/`, `/script.js`, `/styles.css`): Serves the web application files
2. **RPC Endpoint** (`/rpc`): Handles JSON-RPC-style procedure calls

Available procedures:
- `add({ a, b })`: Returns the sum of two numbers

### Client Side (`script.js`)

The client implements:
- `RPC(method, params)`: Helper function to format RPC requests
- `CALCULATOR.ADD({ a, b })`: Wrapper for the addition RPC call
- Event handling for user interactions

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)

### Installation & Running

1. Navigate to the project directory:
   ```bash
   cd rpc-sample
   ```

2. Start the server:
   ```bash
   node src/server.js
   ```

3. Open your browser and visit:
   ```
   http://localhost:3000
   ```

4. Enter two numbers and click "Send RPC Request" to see the RPC call in action

## Technical Details

### RPC Request Format

```json
{
  "method": "add",
  "params": { "a": 5, "b": 3 }
}
```

### RPC Response Format

Success:
```json
{
  "result": { "result": 8 }
}
```

Error:
```json
{
  "error": "Method not found"
}
```

## Extending the Project

To add new RPC procedures:

1. Add a new entry to the `procedures` object in `server.js`:
   ```javascript
   const procedures = {
     add: async ({ a, b }) => {
       return { result: a + b }
     },
     multiply: async ({ a, b }) => {
       return { result: a * b }
     }
   }
   ```

2. Create a corresponding client function in `script.js`:
   ```javascript
   async function MULTIPLY({ a, b }) {
     const response = await fetch('/rpc', RPC('multiply', { a, b }))
     return await response.json()
   }
   ```

## License

This is a sample project for educational purposes.
