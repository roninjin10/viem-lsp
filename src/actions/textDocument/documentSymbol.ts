import type { Client, Transport } from 'viem'
import type { DocumentSymbolParams, DocumentSymbol, SymbolInformation } from 'vscode-languageserver-protocol'

export type DocumentSymbolParameters = DocumentSymbolParams

export type DocumentSymbolReturnType = DocumentSymbol[] | SymbolInformation[] | null

export async function documentSymbol<transport extends Transport>(
  client: Client<transport>,
  params: DocumentSymbolParameters,
): Promise<DocumentSymbolReturnType> {
  return client.request({
    method: 'textDocument/documentSymbol' as any,
    params: params as any,
  }) as Promise<DocumentSymbolReturnType>
}
