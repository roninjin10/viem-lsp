import type { Client, Transport } from 'viem'
import type { ColorPresentationParams, ColorPresentation } from 'vscode-languageserver-protocol'

export type ColorPresentationParameters = ColorPresentationParams

export type ColorPresentationReturnType = ColorPresentation[] | null

export async function colorPresentation<transport extends Transport>(
  client: Client<transport>,
  params: ColorPresentationParameters,
): Promise<ColorPresentationReturnType> {
  return client.request({
    method: 'textDocument/colorPresentation' as any,
    params: params as any,
  }) as Promise<ColorPresentationReturnType>
}
