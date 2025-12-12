import type { Client, Transport } from 'viem'
import type { InitializeParams, InitializeResult } from 'vscode-languageserver-protocol'

export type InitializeParameters = InitializeParams

export type InitializeReturnType = InitializeResult

export async function initialize<transport extends Transport>(
  client: Client<transport>,
  params: InitializeParameters,
): Promise<InitializeReturnType> {
  return client.request({
    method: 'initialize' as any,
    params: params as any,
  }) as Promise<InitializeReturnType>
}
