import type { Client, Transport } from 'viem'
import type { DocumentOnTypeFormattingParams, TextEdit } from 'vscode-languageserver-protocol'

export type OnTypeFormattingParameters = DocumentOnTypeFormattingParams

export type OnTypeFormattingReturnType = TextEdit[] | null

export async function onTypeFormatting<transport extends Transport>(
  client: Client<transport>,
  params: OnTypeFormattingParameters,
): Promise<OnTypeFormattingReturnType> {
  return client.request({
    method: 'textDocument/onTypeFormatting' as any,
    params: params as any,
  }) as Promise<OnTypeFormattingReturnType>
}
