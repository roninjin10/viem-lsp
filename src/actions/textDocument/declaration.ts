import type { Client, Transport } from 'viem'
import type { DeclarationParams, Declaration } from 'vscode-languageserver-protocol'

export type DeclarationParameters = DeclarationParams

export type DeclarationReturnType = Declaration | null

export async function declaration<transport extends Transport>(
  client: Client<transport>,
  params: DeclarationParameters,
): Promise<DeclarationReturnType> {
  return client.request({
    method: 'textDocument/declaration' as any,
    params: params as any,
  }) as Promise<DeclarationReturnType>
}
