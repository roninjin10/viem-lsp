import type { Client, Transport } from 'viem'
import type { HoverParams, Hover } from 'vscode-languageserver-protocol'

export type HoverParameters = HoverParams

export type HoverReturnType = Hover | null

export async function hover<transport extends Transport>(
  client: Client<transport>,
  params: HoverParameters,
): Promise<HoverReturnType> {
  return client.request({
    method: 'textDocument/hover' as any,
    params: params as any,
  }) as Promise<HoverReturnType>
}
