import type { Client, Transport } from 'viem'
import type { DidCloseTextDocumentParams } from 'vscode-languageserver-protocol'

export type DidCloseParameters = DidCloseTextDocumentParams

export async function didClose<transport extends Transport>(
  client: Client<transport>,
  params: DidCloseParameters,
): Promise<void> {
  await client.request({
    method: 'textDocument/didClose' as any,
    params: params as any,
  })
}
