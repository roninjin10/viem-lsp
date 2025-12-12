import type { Client, Transport } from 'viem'
import type { WorkspaceSymbolParams, WorkspaceSymbol } from 'vscode-languageserver-protocol'

export type SymbolParameters = WorkspaceSymbolParams

export type SymbolReturnType = WorkspaceSymbol[] | null

export async function symbol<transport extends Transport>(
  client: Client<transport>,
  params: SymbolParameters,
): Promise<SymbolReturnType> {
  return client.request({
    method: 'workspace/symbol' as any,
    params: params as any,
  }) as Promise<SymbolReturnType>
}
