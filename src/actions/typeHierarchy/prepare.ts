import type { Client, Transport } from 'viem'
import type { TypeHierarchyPrepareParams, TypeHierarchyItem } from 'vscode-languageserver-protocol'

export type PrepareTypeHierarchyParameters = TypeHierarchyPrepareParams

export type PrepareTypeHierarchyReturnType = TypeHierarchyItem[] | null

export async function prepareTypeHierarchy<transport extends Transport>(
  client: Client<transport>,
  params: PrepareTypeHierarchyParameters,
): Promise<PrepareTypeHierarchyReturnType> {
  return client.request({
    method: 'textDocument/prepareTypeHierarchy' as any,
    params: params as any,
  }) as Promise<PrepareTypeHierarchyReturnType>
}
