import type { Client, Transport } from 'viem'
import type { SignatureHelpParams, SignatureHelp } from 'vscode-languageserver-protocol'

export type SignatureHelpParameters = SignatureHelpParams

export type SignatureHelpReturnType = SignatureHelp | null

export async function signatureHelp<transport extends Transport>(
  client: Client<transport>,
  params: SignatureHelpParameters,
): Promise<SignatureHelpReturnType> {
  return client.request({
    method: 'textDocument/signatureHelp' as any,
    params: params as any,
  }) as Promise<SignatureHelpReturnType>
}
