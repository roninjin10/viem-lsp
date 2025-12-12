import type { Client, Transport } from 'viem'
import type { CompletionParams, CompletionItem, CompletionList } from 'vscode-languageserver-protocol'

export type CompletionParameters = CompletionParams

export type CompletionReturnType = CompletionItem[] | CompletionList | null

export async function completion<transport extends Transport>(
  client: Client<transport>,
  params: CompletionParameters,
): Promise<CompletionReturnType> {
  return client.request({
    method: 'textDocument/completion' as any,
    params: params as any,
  }) as Promise<CompletionReturnType>
}
