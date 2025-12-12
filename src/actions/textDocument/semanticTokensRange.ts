import type { Client, Transport } from 'viem'
import type { SemanticTokensRangeParams, SemanticTokens } from 'vscode-languageserver-protocol'

export type SemanticTokensRangeParameters = SemanticTokensRangeParams

export type SemanticTokensRangeReturnType = SemanticTokens | null

export async function semanticTokensRange<transport extends Transport>(
  client: Client<transport>,
  params: SemanticTokensRangeParameters,
): Promise<SemanticTokensRangeReturnType> {
  return client.request({
    method: 'textDocument/semanticTokens/range' as any,
    params: params as any,
  }) as Promise<SemanticTokensRangeReturnType>
}
