import type { Client, Transport } from 'viem'
import type { TypeDefinitionParams, Definition } from 'vscode-languageserver-protocol'

export type TypeDefinitionParameters = TypeDefinitionParams

export type TypeDefinitionReturnType = Definition | null

export async function typeDefinition<transport extends Transport>(
  client: Client<transport>,
  params: TypeDefinitionParameters,
): Promise<TypeDefinitionReturnType> {
  return client.request({
    method: 'textDocument/typeDefinition' as any,
    params: params as any,
  }) as Promise<TypeDefinitionReturnType>
}
