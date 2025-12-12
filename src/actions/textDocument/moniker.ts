import type { Client, Transport } from 'viem'
import type { MonikerParams, Moniker } from 'vscode-languageserver-protocol'

export type MonikerParameters = MonikerParams

export type MonikerReturnType = Moniker[] | null

export async function moniker<transport extends Transport>(
  client: Client<transport>,
  params: MonikerParameters,
): Promise<MonikerReturnType> {
  return client.request({
    method: 'textDocument/moniker' as any,
    params: params as any,
  }) as Promise<MonikerReturnType>
}
