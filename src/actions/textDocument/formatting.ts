import type { Client, Transport } from 'viem'
import type { DocumentFormattingParams, TextEdit } from 'vscode-languageserver-protocol'

export type FormattingParameters = DocumentFormattingParams

export type FormattingReturnType = TextEdit[] | null

export async function formatting<transport extends Transport>(
  client: Client<transport>,
  params: FormattingParameters,
): Promise<FormattingReturnType> {
  return client.request({
    method: 'textDocument/formatting' as any,
    params: params as any,
  }) as Promise<FormattingReturnType>
}
