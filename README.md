# viem-lsp

LSP client using Viem's JSON-RPC infrastructure.

## Install

```bash
npm install viem-lsp viem
```

## Usage

```ts
import { createClient } from 'viem'
import { lspActions, stdio } from 'viem-lsp'

const client = createClient({
  transport: stdio({ command: 'typescript-language-server', args: ['--stdio'] }),
}).extend(lspActions)

await client.initialize({
  processId: process.pid,
  rootUri: 'file:///path/to/project',
  capabilities: {},
})
await client.initialized()

// Open a document
await client.didOpen({
  textDocument: {
    uri: 'file:///path/to/project/index.ts',
    languageId: 'typescript',
    version: 1,
    text: 'const foo = 1',
  },
})

// Get hover information
const hover = await client.hover({
  textDocument: { uri: 'file:///path/to/project/index.ts' },
  position: { line: 0, character: 6 },
})

// Go to definition
const definition = await client.definition({
  textDocument: { uri: 'file:///path/to/project/index.ts' },
  position: { line: 10, character: 5 },
})

// Find all references
const refs = await client.references({
  textDocument: { uri: 'file:///path/to/project/index.ts' },
  position: { line: 0, character: 6 },
  context: { includeDeclaration: true },
})

// Get completions
const completions = await client.completion({
  textDocument: { uri: 'file:///path/to/project/index.ts' },
  position: { line: 5, character: 10 },
})

// Rename a symbol across the project
const edits = await client.rename({
  textDocument: { uri: 'file:///path/to/project/index.ts' },
  position: { line: 0, character: 6 },
  newName: 'bar',
})

// Format the document
const formatEdits = await client.formatting({
  textDocument: { uri: 'file:///path/to/project/index.ts' },
  options: { tabSize: 2, insertSpaces: true },
})

// Clean shutdown
await client.shutdown()
await client.exit()
```

## Transports

```ts
import { stdio, tcp, webSocket } from 'viem-lsp'

// Spawn a language server process
stdio({ command: 'typescript-language-server', args: ['--stdio'] })

// Connect to a running server over TCP
tcp({ host: 'localhost', port: 5007 })

// Connect over WebSocket
webSocket({ url: 'ws://localhost:5007' })
```

## License

MIT
