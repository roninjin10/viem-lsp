import type { Client, Transport } from 'viem'
import type { CallHierarchyPrepareParams, CallHierarchyItem } from 'vscode-languageserver-protocol'

export type PrepareCallHierarchyParameters = CallHierarchyPrepareParams

export type PrepareCallHierarchyReturnType = CallHierarchyItem[] | null

export async function prepareCallHierarchy<transport extends Transport>(
  client: Client<transport>,
  params: PrepareCallHierarchyParameters,
): Promise<PrepareCallHierarchyReturnType> {
  return client.request({
    method: 'textDocument/prepareCallHierarchy' as any,
    params: params as any,
  }) as Promise<PrepareCallHierarchyReturnType>
}
