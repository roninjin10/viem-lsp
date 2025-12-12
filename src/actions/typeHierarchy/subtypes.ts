import type { Client, Transport } from 'viem'
import type { TypeHierarchySubtypesParams, TypeHierarchyItem } from 'vscode-languageserver-protocol'

export type TypeHierarchySubtypesParameters = TypeHierarchySubtypesParams

export type TypeHierarchySubtypesReturnType = TypeHierarchyItem[] | null

export async function typeHierarchySubtypes<transport extends Transport>(
  client: Client<transport>,
  params: TypeHierarchySubtypesParameters,
): Promise<TypeHierarchySubtypesReturnType> {
  return client.request({
    method: 'typeHierarchy/subtypes' as any,
    params: params as any,
  }) as Promise<TypeHierarchySubtypesReturnType>
}
