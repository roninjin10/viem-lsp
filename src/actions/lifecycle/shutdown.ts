import type { Client, Transport } from 'viem'

export async function shutdown<transport extends Transport>(
  client: Client<transport>,
): Promise<void> {
  await client.request({
    method: 'shutdown' as any,
  })
}
