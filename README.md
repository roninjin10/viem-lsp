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
}).extend(lspActions())

await client.initialize({ capabilities: {} })
```

## License

MIT
