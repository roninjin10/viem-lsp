import type { Client, Transport } from 'viem'
import type { DocumentColorParams, ColorInformation } from 'vscode-languageserver-protocol'

export type DocumentColorParameters = DocumentColorParams

export type DocumentColorReturnType = ColorInformation[] | null

export async function documentColor<transport extends Transport>(
  client: Client<transport>,
  params: DocumentColorParameters,
): Promise<DocumentColorReturnType> {
  return client.request({
    method: 'textDocument/documentColor' as any,
    params: params as any,
  }) as Promise<DocumentColorReturnType>
}
