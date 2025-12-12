import type { Client, Transport } from 'viem'
import type { RenameFilesParams, WorkspaceEdit } from 'vscode-languageserver-protocol'

export type WillRenameFilesParameters = RenameFilesParams

export type WillRenameFilesReturnType = WorkspaceEdit | null

export async function willRenameFiles<transport extends Transport>(
  client: Client<transport>,
  params: WillRenameFilesParameters,
): Promise<WillRenameFilesReturnType> {
  return client.request({
    method: 'workspace/willRenameFiles' as any,
    params: params as any,
  }) as Promise<WillRenameFilesReturnType>
}
