import type { Client, Transport } from 'viem'

export async function exit<transport extends Transport>(
  client: Client<transport>,
): Promise<void> {
  await client.request({
    method: 'exit' as any,
  })
}
