import type { Client, Transport } from 'viem'
import type { ReferenceParams, Location } from 'vscode-languageserver-protocol'

export type ReferencesParameters = ReferenceParams

export type ReferencesReturnType = Location[] | null

export async function references<transport extends Transport>(
  client: Client<transport>,
  params: ReferencesParameters,
): Promise<ReferencesReturnType> {
  return client.request({
    method: 'textDocument/references' as any,
    params: params as any,
  }) as Promise<ReferencesReturnType>
}
