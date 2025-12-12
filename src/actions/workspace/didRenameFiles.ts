import type { Client, Transport } from 'viem'
import type { RenameFilesParams } from 'vscode-languageserver-protocol'

export type DidRenameFilesParameters = RenameFilesParams

export type DidRenameFilesReturnType = void

export async function didRenameFiles<transport extends Transport>(
  client: Client<transport>,
  params: DidRenameFilesParameters,
): Promise<DidRenameFilesReturnType> {
  return client.request({
    method: 'workspace/didRenameFiles' as any,
    params: params as any,
  }) as Promise<DidRenameFilesReturnType>
}
