import type { Client, Transport } from 'viem'
import type { CallHierarchyOutgoingCallsParams, CallHierarchyOutgoingCall } from 'vscode-languageserver-protocol'

export type CallHierarchyOutgoingCallsParameters = CallHierarchyOutgoingCallsParams

export type CallHierarchyOutgoingCallsReturnType = CallHierarchyOutgoingCall[] | null

export async function callHierarchyOutgoingCalls<transport extends Transport>(
  client: Client<transport>,
  params: CallHierarchyOutgoingCallsParameters,
): Promise<CallHierarchyOutgoingCallsReturnType> {
  return client.request({
    method: 'callHierarchy/outgoingCalls' as any,
    params: params as any,
  }) as Promise<CallHierarchyOutgoingCallsReturnType>
}
