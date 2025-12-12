import { custom } from 'viem'
import { spawn, type ChildProcess } from 'node:child_process'
import { JsonRpcEndpoint } from '../utils/framing.js'

export type StdioTransportConfig = {
  command: string
  args?: string[]
  cwd?: string
  env?: NodeJS.ProcessEnv
}

// LSP notification methods (no response expected)
const NOTIFICATION_METHODS = new Set([
  'initialized',
  'exit',
  'textDocument/didOpen',
  'textDocument/didChange',
  'textDocument/didClose',
  'textDocument/didSave',
  'textDocument/willSave',
  'workspace/didChangeConfiguration',
  'workspace/didChangeWatchedFiles',
  'workspace/didCreateFiles',
  'workspace/didRenameFiles',
  'workspace/didDeleteFiles',
  '$/setTrace',
  '$/logTrace',
  '$/cancelRequest',
  'notebookDocument/didOpen',
  'notebookDocument/didChange',
  'notebookDocument/didSave',
  'notebookDocument/didClose',
])

export function stdio(config: StdioTransportConfig) {
  let process: ChildProcess | null = null
  let endpoint: JsonRpcEndpoint | null = null

  const ensureConnection = () => {
    if (!process) {
      process = spawn(config.command, config.args ?? [], {
        cwd: config.cwd,
        env: config.env ?? globalThis.process.env,
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      if (!process.stdin || !process.stdout) {
        throw new Error('Failed to spawn process with stdio')
      }

      endpoint = new JsonRpcEndpoint(process.stdin, process.stdout)

      process.on('error', (err) => {
        console.error('LSP process error:', err)
      })

      process.on('exit', (code) => {
        process = null
        endpoint = null
      })
    }
    return endpoint!
  }

  return custom(
    {
      async request({ method, params }) {
        const ep = ensureConnection()
        // Check if this is a notification (no response expected)
        if (NOTIFICATION_METHODS.has(method)) {
          ep.notify(method, params as unknown)
          return undefined
        }
        return ep.request(method, params as unknown)
      },
    },
    {
      key: 'stdio',
      name: 'LSP Stdio Transport',
    }
  )
}
