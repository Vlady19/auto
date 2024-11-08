import { activate } from '@autonomys/auto-utils';
import { balance } from '@autonomys/auto-consensus';

export default async function handler(req, res) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Missing address.' });
  }

  try {
    const api = await activate({ provider: 'wss://rpc.mainnet.subspace.foundation/ws' });
    const accountBalance = await balance(api, address);
    await api.disconnect();

    res.status(200).json({ balance: accountBalance.free.toString() });
  } catch (error) {
    console.error('Error retrieving balance:', error);
    res.status(500).json({ error: 'Error retrieving balance.' });
  }
}
