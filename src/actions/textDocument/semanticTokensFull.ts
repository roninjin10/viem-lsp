import type { Client, Transport } from 'viem'
import type { SemanticTokensParams, SemanticTokens } from 'vscode-languageserver-protocol'

export type SemanticTokensFullParameters = SemanticTokensParams

export type SemanticTokensFullReturnType = SemanticTokens | null

export async function semanticTokensFull<transport extends Transport>(
  client: Client<transport>,
  params: SemanticTokensFullParameters,
): Promise<SemanticTokensFullReturnType> {
  return client.request({
    method: 'textDocument/semanticTokens/full' as any,
    params: params as any,
  }) as Promise<SemanticTokensFullReturnType>
}
