import { custom } from 'viem'

type PendingRequest = {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
}

export type WebSocketTransportConfig = {
  url: string
  protocols?: string | string[]
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

export function webSocket(config: WebSocketTransportConfig) {
  let ws: WebSocket | null = null
  let nextId = 1
  const pendingRequests = new Map<number | string, PendingRequest>()

  const ensureConnection = async () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      ws = await new Promise<WebSocket>((resolve, reject) => {
        const socket = new WebSocket(config.url, config.protocols)
        socket.onopen = () => resolve(socket)
        socket.onerror = (e) => reject(e)
      })

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data as string)
        if (message.id !== undefined && (message.result !== undefined || message.error !== undefined)) {
          const pending = pendingRequests.get(message.id)
          if (pending) {
            pendingRequests.delete(message.id)
            if (message.error) {
              pending.reject(new Error(message.error.message))
            } else {
              pending.resolve(message.result)
            }
          }
        }
      }

      ws.onclose = () => {
        ws = null
      }
    }
    return ws
  }

  return custom(
    {
      async request({ method, params }) {
        const socket = await ensureConnection()

        // Handle notifications (no response expected)
        if (NOTIFICATION_METHODS.has(method)) {
          socket.send(JSON.stringify({ jsonrpc: '2.0', method, params }))
          return undefined
        }

        const id = nextId++
        return new Promise((resolve, reject) => {
          pendingRequests.set(id, { resolve, reject })
          socket.send(JSON.stringify({ jsonrpc: '2.0', id, method, params }))
        })
      },
    },
    {
      key: 'webSocket',
      name: 'LSP WebSocket Transport',
    }
  )
}
