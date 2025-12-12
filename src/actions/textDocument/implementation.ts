import type { Client, Transport } from 'viem'
import type { ImplementationParams, Definition } from 'vscode-languageserver-protocol'

export type ImplementationParameters = ImplementationParams

export type ImplementationReturnType = Definition | null

export async function implementation<transport extends Transport>(
  client: Client<transport>,
  params: ImplementationParameters,
): Promise<ImplementationReturnType> {
  return client.request({
    method: 'textDocument/implementation' as any,
    params: params as any,
  }) as Promise<ImplementationReturnType>
}
