import type { Client, Transport } from 'viem'
import type { LinkedEditingRangeParams, LinkedEditingRanges } from 'vscode-languageserver-protocol'

export type LinkedEditingRangeParameters = LinkedEditingRangeParams

export type LinkedEditingRangeReturnType = LinkedEditingRanges | null

export async function linkedEditingRange<transport extends Transport>(
  client: Client<transport>,
  params: LinkedEditingRangeParameters,
): Promise<LinkedEditingRangeReturnType> {
  return client.request({
    method: 'textDocument/linkedEditingRange' as any,
    params: params as any,
  }) as Promise<LinkedEditingRangeReturnType>
}
