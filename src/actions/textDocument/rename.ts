import type { Client, Transport } from 'viem'
import type { RenameParams, WorkspaceEdit } from 'vscode-languageserver-protocol'

export type RenameParameters = RenameParams

export type RenameReturnType = WorkspaceEdit | null

export async function rename<transport extends Transport>(
  client: Client<transport>,
  params: RenameParameters,
): Promise<RenameReturnType> {
  return client.request({
    method: 'textDocument/rename' as any,
    params: params as any,
  }) as Promise<RenameReturnType>
}
