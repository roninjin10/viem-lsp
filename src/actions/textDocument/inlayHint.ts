import type { Client, Transport } from 'viem'
import type { InlayHintParams, InlayHint } from 'vscode-languageserver-protocol'

export type InlayHintParameters = InlayHintParams

export type InlayHintReturnType = InlayHint[] | null

export async function inlayHint<transport extends Transport>(
  client: Client<transport>,
  params: InlayHintParameters,
): Promise<InlayHintReturnType> {
  return client.request({
    method: 'textDocument/inlayHint' as any,
    params: params as any,
  }) as Promise<InlayHintReturnType>
}
