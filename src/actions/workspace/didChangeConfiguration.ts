import type { Client, Transport } from 'viem'
import type { DidChangeConfigurationParams } from 'vscode-languageserver-protocol'

export type DidChangeConfigurationParameters = DidChangeConfigurationParams

export type DidChangeConfigurationReturnType = void

export async function didChangeConfiguration<transport extends Transport>(
  client: Client<transport>,
  params: DidChangeConfigurationParameters,
): Promise<DidChangeConfigurationReturnType> {
  return client.request({
    method: 'workspace/didChangeConfiguration' as any,
    params: params as any,
  }) as Promise<DidChangeConfigurationReturnType>
}
