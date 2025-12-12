import type { Client, Transport } from 'viem'
import type { ConfigurationParams } from 'vscode-languageserver-protocol'

export type ConfigurationParameters = ConfigurationParams

export type ConfigurationReturnType = any[]

export async function configuration<transport extends Transport>(
  client: Client<transport>,
  params: ConfigurationParameters,
): Promise<ConfigurationReturnType> {
  return client.request({
    method: 'workspace/configuration' as any,
    params: params as any,
  }) as Promise<ConfigurationReturnType>
}
