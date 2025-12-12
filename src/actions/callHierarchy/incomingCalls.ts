import type { Client, Transport } from 'viem'
import type { CallHierarchyIncomingCallsParams, CallHierarchyIncomingCall } from 'vscode-languageserver-protocol'

export type CallHierarchyIncomingCallsParameters = CallHierarchyIncomingCallsParams

export type CallHierarchyIncomingCallsReturnType = CallHierarchyIncomingCall[] | null

export async function callHierarchyIncomingCalls<transport extends Transport>(
  client: Client<transport>,
  params: CallHierarchyIncomingCallsParameters,
): Promise<CallHierarchyIncomingCallsReturnType> {
  return client.request({
    method: 'callHierarchy/incomingCalls' as any,
    params: params as any,
  }) as Promise<CallHierarchyIncomingCallsReturnType>
}
