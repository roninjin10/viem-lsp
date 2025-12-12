import type { Client, Transport } from 'viem'
import type { DeleteFilesParams } from 'vscode-languageserver-protocol'

export type DidDeleteFilesParameters = DeleteFilesParams

export type DidDeleteFilesReturnType = void

export async function didDeleteFiles<transport extends Transport>(
  client: Client<transport>,
  params: DidDeleteFilesParameters,
): Promise<DidDeleteFilesReturnType> {
  return client.request({
    method: 'workspace/didDeleteFiles' as any,
    params: params as any,
  }) as Promise<DidDeleteFilesReturnType>
}
