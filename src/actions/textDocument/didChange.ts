import type { Client, Transport } from 'viem'
import type { DidChangeTextDocumentParams } from 'vscode-languageserver-protocol'

export type DidChangeParameters = DidChangeTextDocumentParams

export async function didChange<transport extends Transport>(
  client: Client<transport>,
  params: DidChangeParameters,
): Promise<void> {
  await client.request({
    method: 'textDocument/didChange' as any,
    params: params as any,
  })
}
