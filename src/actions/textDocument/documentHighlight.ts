import type { Client, Transport } from 'viem'
import type { DocumentHighlightParams, DocumentHighlight } from 'vscode-languageserver-protocol'

export type DocumentHighlightParameters = DocumentHighlightParams

export type DocumentHighlightReturnType = DocumentHighlight[] | null

export async function documentHighlight<transport extends Transport>(
  client: Client<transport>,
  params: DocumentHighlightParameters,
): Promise<DocumentHighlightReturnType> {
  return client.request({
    method: 'textDocument/documentHighlight' as any,
    params: params as any,
  }) as Promise<DocumentHighlightReturnType>
}
