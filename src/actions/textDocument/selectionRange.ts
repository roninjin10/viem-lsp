import type { Client, Transport } from 'viem'
import type { SelectionRangeParams, SelectionRange } from 'vscode-languageserver-protocol'

export type SelectionRangeParameters = SelectionRangeParams

export type SelectionRangeReturnType = SelectionRange[] | null

export async function selectionRange<transport extends Transport>(
  client: Client<transport>,
  params: SelectionRangeParameters,
): Promise<SelectionRangeReturnType> {
  return client.request({
    method: 'textDocument/selectionRange' as any,
    params: params as any,
  }) as Promise<SelectionRangeReturnType>
}
