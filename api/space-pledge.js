import { spacePledge } from '@autonomys/auto-consensus';
import { activate } from '@autonomys/auto-utils';

const MAINNET_WS_URL = 'wss://rpc.mainnet.subspace.foundation/ws';
let api;

(async () => {
  try {
    api = await activate(MAINNET_WS_URL);
    console.log('API activated successfully on Mainnet.');
  } catch (error) {
    console.error('Error activating API on Mainnet:', error);
  }
})();

export default async function handler(req, res) {
  try {
    if (!api) {
      return res.status(503).json({ error: 'API not ready yet' });
    }

    const spacePledged = await spacePledge(api);
    const blockHeight = await api.query.system.number(); // Récupère le block height

    res.status(200).json({ spacePledged: spacePledged.toString(), blockHeight: blockHeight.toString() });
  } catch (error) {
    console.error('Error fetching spacePledged on Mainnet:', error);
    res.status(500).json({ error: 'Failed to fetch space pledged' });
  }
}
