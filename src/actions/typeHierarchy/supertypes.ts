import type { Client, Transport } from 'viem'
import type { TypeHierarchySupertypesParams, TypeHierarchyItem } from 'vscode-languageserver-protocol'

export type TypeHierarchySupertypesParameters = TypeHierarchySupertypesParams

export type TypeHierarchySupertypesReturnType = TypeHierarchyItem[] | null

export async function typeHierarchySupertypes<transport extends Transport>(
  client: Client<transport>,
  params: TypeHierarchySupertypesParameters,
): Promise<TypeHierarchySupertypesReturnType> {
  return client.request({
    method: 'typeHierarchy/supertypes' as any,
    params: params as any,
  }) as Promise<TypeHierarchySupertypesReturnType>
}
