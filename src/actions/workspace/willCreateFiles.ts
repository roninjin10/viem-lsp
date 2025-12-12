import type { Client, Transport } from 'viem'
import type { CreateFilesParams, WorkspaceEdit } from 'vscode-languageserver-protocol'

export type WillCreateFilesParameters = CreateFilesParams

export type WillCreateFilesReturnType = WorkspaceEdit | null

export async function willCreateFiles<transport extends Transport>(
  client: Client<transport>,
  params: WillCreateFilesParameters,
): Promise<WillCreateFilesReturnType> {
  return client.request({
    method: 'workspace/willCreateFiles' as any,
    params: params as any,
  }) as Promise<WillCreateFilesReturnType>
}
