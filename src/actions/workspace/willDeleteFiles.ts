import type { Client, Transport } from 'viem'
import type { DeleteFilesParams, WorkspaceEdit } from 'vscode-languageserver-protocol'

export type WillDeleteFilesParameters = DeleteFilesParams

export type WillDeleteFilesReturnType = WorkspaceEdit | null

export async function willDeleteFiles<transport extends Transport>(
  client: Client<transport>,
  params: WillDeleteFilesParameters,
): Promise<WillDeleteFilesReturnType> {
  return client.request({
    method: 'workspace/willDeleteFiles' as any,
    params: params as any,
  }) as Promise<WillDeleteFilesReturnType>
}
