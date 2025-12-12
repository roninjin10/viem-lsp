import { custom } from 'viem'
import { createConnection, type Socket } from 'node:net'
import { JsonRpcEndpoint } from '../utils/framing.js'

export type TcpTransportConfig = {
  host: string
  port: number
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

export function tcp(config: TcpTransportConfig) {
  let socket: Socket | null = null
  let endpoint: JsonRpcEndpoint | null = null

  const ensureConnection = async () => {
    if (!socket) {
      socket = await new Promise<Socket>((resolve, reject) => {
        const s = createConnection(config.port, config.host, () => resolve(s))
        s.on('error', reject)
      })

      endpoint = new JsonRpcEndpoint(socket, socket)

      socket.on('close', () => {
        socket = null
        endpoint = null
      })
    }
    return endpoint!
  }

  return custom(
    {
      async request({ method, params }) {
        const ep = await ensureConnection()
        if (NOTIFICATION_METHODS.has(method)) {
          ep.notify(method, params as unknown)
          return undefined
        }
        return ep.request(method, params as unknown)
      },
    },
    {
      key: 'tcp',
      name: 'LSP TCP Transport',
    }
  )
}
