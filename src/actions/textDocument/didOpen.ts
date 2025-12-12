import type { Client, Transport } from 'viem'
import type { DidOpenTextDocumentParams } from 'vscode-languageserver-protocol'

export type DidOpenParameters = DidOpenTextDocumentParams

export async function didOpen<transport extends Transport>(
  client: Client<transport>,
  params: DidOpenParameters,
): Promise<void> {
  await client.request({
    method: 'textDocument/didOpen' as any,
    params: params as any,
  })
}
