import type { Client, Transport } from 'viem'
import type { ApplyWorkspaceEditParams, ApplyWorkspaceEditResult } from 'vscode-languageserver-protocol'

export type ApplyEditParameters = ApplyWorkspaceEditParams

export type ApplyEditReturnType = ApplyWorkspaceEditResult

export async function applyEdit<transport extends Transport>(
  client: Client<transport>,
  params: ApplyEditParameters,
): Promise<ApplyEditReturnType> {
  return client.request({
    method: 'workspace/applyEdit' as any,
    params: params as any,
  }) as Promise<ApplyEditReturnType>
}
