import type { Client, Transport } from 'viem'
import type { PrepareRenameParams, Range } from 'vscode-languageserver-protocol'

export type PrepareRenameParameters = PrepareRenameParams

export type PrepareRenameReturnType = { range: Range; placeholder: string } | Range | null

export async function prepareRename<transport extends Transport>(
  client: Client<transport>,
  params: PrepareRenameParameters,
): Promise<PrepareRenameReturnType> {
  return client.request({
    method: 'textDocument/prepareRename' as any,
    params: params as any,
  }) as Promise<PrepareRenameReturnType>
}
