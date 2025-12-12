import type { Client, Transport } from 'viem'
import type { InitializedParams } from 'vscode-languageserver-protocol'

export type InitializedParameters = InitializedParams

export async function initialized<transport extends Transport>(
  client: Client<transport>,
  params: InitializedParameters = {},
): Promise<void> {
  await client.request({
    method: 'initialized' as any,
    params: params as any,
  })
}
