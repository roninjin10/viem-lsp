import type { Client, Transport } from 'viem'
import type { FoldingRangeParams, FoldingRange } from 'vscode-languageserver-protocol'

export type FoldingRangeParameters = FoldingRangeParams

export type FoldingRangeReturnType = FoldingRange[] | null

export async function foldingRange<transport extends Transport>(
  client: Client<transport>,
  params: FoldingRangeParameters,
): Promise<FoldingRangeReturnType> {
  return client.request({
    method: 'textDocument/foldingRange' as any,
    params: params as any,
  }) as Promise<FoldingRangeReturnType>
}
