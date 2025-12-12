import type { Client, Transport } from 'viem'
import type { CodeLensParams, CodeLens } from 'vscode-languageserver-protocol'

export type CodeLensParameters = CodeLensParams

export type CodeLensReturnType = CodeLens[] | null

export async function codeLens<transport extends Transport>(
  client: Client<transport>,
  params: CodeLensParameters,
): Promise<CodeLensReturnType> {
  return client.request({
    method: 'textDocument/codeLens' as any,
    params: params as any,
  }) as Promise<CodeLensReturnType>
}
