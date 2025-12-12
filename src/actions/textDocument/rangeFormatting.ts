import type { Client, Transport } from 'viem'
import type { DocumentRangeFormattingParams, TextEdit } from 'vscode-languageserver-protocol'

export type RangeFormattingParameters = DocumentRangeFormattingParams

export type RangeFormattingReturnType = TextEdit[] | null

export async function rangeFormatting<transport extends Transport>(
  client: Client<transport>,
  params: RangeFormattingParameters,
): Promise<RangeFormattingReturnType> {
  return client.request({
    method: 'textDocument/rangeFormatting' as any,
    params: params as any,
  }) as Promise<RangeFormattingReturnType>
}
