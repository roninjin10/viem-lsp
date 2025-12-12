import type { Client, Transport } from 'viem'
import type { DocumentLinkParams, DocumentLink } from 'vscode-languageserver-protocol'

export type DocumentLinkParameters = DocumentLinkParams

export type DocumentLinkReturnType = DocumentLink[] | null

export async function documentLink<transport extends Transport>(
  client: Client<transport>,
  params: DocumentLinkParameters,
): Promise<DocumentLinkReturnType> {
  return client.request({
    method: 'textDocument/documentLink' as any,
    params: params as any,
  }) as Promise<DocumentLinkReturnType>
}
