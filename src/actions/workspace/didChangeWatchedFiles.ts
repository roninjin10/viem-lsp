import type { Client, Transport } from 'viem'
import type { DidChangeWatchedFilesParams } from 'vscode-languageserver-protocol'

export type DidChangeWatchedFilesParameters = DidChangeWatchedFilesParams

export type DidChangeWatchedFilesReturnType = void

export async function didChangeWatchedFiles<transport extends Transport>(
  client: Client<transport>,
  params: DidChangeWatchedFilesParameters,
): Promise<DidChangeWatchedFilesReturnType> {
  return client.request({
    method: 'workspace/didChangeWatchedFiles' as any,
    params: params as any,
  }) as Promise<DidChangeWatchedFilesReturnType>
}
