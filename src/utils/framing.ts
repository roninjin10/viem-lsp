import type { Readable, Writable } from 'node:stream'

export type JsonRpcMessage = {
  jsonrpc: '2.0'
  id?: number | string
  method?: string
  params?: unknown
  result?: unknown
  error?: { code: number; message: string; data?: unknown }
}

export type PendingRequest = {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
}

export class JsonRpcEndpoint {
  private pendingRequests = new Map<number | string, PendingRequest>()
  private nextId = 1
  private buffer = ''
  private contentLength: number | null = null
  private notificationHandlers: ((method: string, params: unknown) => void)[] = []
  private requestHandlers: ((method: string, params: unknown, id: number | string) => void)[] = []

  constructor(
    private output: Writable,
    input: Readable
  ) {
    input.on('data', (chunk: Buffer) => this.handleData(chunk.toString('utf-8')))
  }

  private handleData(data: string) {
    this.buffer += data

    while (true) {
      if (this.contentLength === null) {
        const headerEnd = this.buffer.indexOf('\r\n\r\n')
        if (headerEnd === -1) return

        const header = this.buffer.substring(0, headerEnd)
        const match = header.match(/Content-Length:\s*(\d+)/i)
        if (!match) {
          throw new Error('Invalid LSP message: missing Content-Length')
        }

        this.contentLength = parseInt(match[1], 10)
        this.buffer = this.buffer.substring(headerEnd + 4)
      }

      if (this.buffer.length >= this.contentLength) {
        const body = this.buffer.substring(0, this.contentLength)
        this.buffer = this.buffer.substring(this.contentLength)
        this.contentLength = null

        this.handleMessage(JSON.parse(body) as JsonRpcMessage)
      } else {
        return
      }
    }
  }

  private handleMessage(message: JsonRpcMessage) {
    if (message.id !== undefined && (message.result !== undefined || message.error !== undefined)) {
      // Response to our request
      const pending = this.pendingRequests.get(message.id)
      if (pending) {
        this.pendingRequests.delete(message.id)
        if (message.error) {
          pending.reject(new Error(message.error.message))
        } else {
          pending.resolve(message.result)
        }
      }
    } else if (message.method !== undefined) {
      if (message.id !== undefined) {
        // Request from server
        for (const handler of this.requestHandlers) {
          handler(message.method, message.params, message.id)
        }
      } else {
        // Notification from server
        for (const handler of this.notificationHandlers) {
          handler(message.method, message.params)
        }
      }
    }
  }

  async request(method: string, params?: unknown): Promise<unknown> {
    const id = this.nextId++
    const message: JsonRpcMessage = { jsonrpc: '2.0', id, method, params }

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject })
      this.writeMessage(message)
    })
  }

  notify(method: string, params?: unknown): void {
    const message: JsonRpcMessage = { jsonrpc: '2.0', method, params }
    this.writeMessage(message)
  }

  respond(id: number | string, result: unknown): void {
    const message: JsonRpcMessage = { jsonrpc: '2.0', id, result }
    this.writeMessage(message)
  }

  respondError(id: number | string, code: number, message: string): void {
    const msg: JsonRpcMessage = { jsonrpc: '2.0', id, error: { code, message } }
    this.writeMessage(msg)
  }

  private writeMessage(message: JsonRpcMessage): void {
    const json = JSON.stringify(message)
    const content = Buffer.from(json, 'utf-8')
    const header = `Content-Length: ${content.length}\r\n\r\n`
    this.output.write(header + json)
  }

  onNotification(handler: (method: string, params: unknown) => void): void {
    this.notificationHandlers.push(handler)
  }

  onRequest(handler: (method: string, params: unknown, id: number | string) => void): void {
    this.requestHandlers.push(handler)
  }
}
