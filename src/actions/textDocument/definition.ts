import type { Client, Transport } from 'viem'
import type { DefinitionParams, Definition, LocationLink } from 'vscode-languageserver-protocol'

export type DefinitionParameters = DefinitionParams

export type DefinitionReturnType = Definition | LocationLink[] | null

export async function definition<transport extends Transport>(
  client: Client<transport>,
  params: DefinitionParameters,
): Promise<DefinitionReturnType> {
  return client.request({
    method: 'textDocument/definition' as any,
    params: params as any,
  }) as Promise<DefinitionReturnType>
}
