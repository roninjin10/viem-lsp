import type { Client, Transport } from 'viem'
import type { CodeActionParams, CodeAction, Command } from 'vscode-languageserver-protocol'

export type CodeActionParameters = CodeActionParams

export type CodeActionReturnType = (CodeAction | Command)[] | null

export async function codeAction<transport extends Transport>(
  client: Client<transport>,
  params: CodeActionParameters,
): Promise<CodeActionReturnType> {
  return client.request({
    method: 'textDocument/codeAction' as any,
    params: params as any,
  }) as Promise<CodeActionReturnType>
}
