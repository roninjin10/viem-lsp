import type { Client, Transport } from 'viem'
import type { DidSaveTextDocumentParams } from 'vscode-languageserver-protocol'

export type DidSaveParameters = DidSaveTextDocumentParams

export async function didSave<transport extends Transport>(
  client: Client<transport>,
  params: DidSaveParameters,
): Promise<void> {
  await client.request({
    method: 'textDocument/didSave' as any,
    params: params as any,
  })
}
