import type { Client, Transport } from 'viem'
import type { CreateFilesParams } from 'vscode-languageserver-protocol'

export type DidCreateFilesParameters = CreateFilesParams

export type DidCreateFilesReturnType = void

export async function didCreateFiles<transport extends Transport>(
  client: Client<transport>,
  params: DidCreateFilesParameters,
): Promise<DidCreateFilesReturnType> {
  return client.request({
    method: 'workspace/didCreateFiles' as any,
    params: params as any,
  }) as Promise<DidCreateFilesReturnType>
}
