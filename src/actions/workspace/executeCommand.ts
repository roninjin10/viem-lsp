import type { Client, Transport } from 'viem'
import type { ExecuteCommandParams } from 'vscode-languageserver-protocol'

export type ExecuteCommandParameters = ExecuteCommandParams

export type ExecuteCommandReturnType = any | null

export async function executeCommand<transport extends Transport>(
  client: Client<transport>,
  params: ExecuteCommandParameters,
): Promise<ExecuteCommandReturnType> {
  return client.request({
    method: 'workspace/executeCommand' as any,
    params: params as any,
  }) as Promise<ExecuteCommandReturnType>
}
