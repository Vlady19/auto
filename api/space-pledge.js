import { spacePledge } from '@autonomys/auto-consensus';
import { activate } from '@autonomys/auto-utils';

const MAINNET_WS_URL = 'wss://rpc.mainnet.subspace.foundation/ws';
let api;

// Fonction asynchrone pour activer l'API avec l'URL du Mainnet
(async () => {
  try {
    api = await activate(MAINNET_WS_URL);  // Activation avec l'URL Mainnet
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

    // Récupère la valeur `spacePledged` depuis la blockchain Mainnet
    const spacePledged = await spacePledge(api);

    // Envoie la valeur de `spacePledged` sous forme de chaîne dans la réponse
    res.status(200).json({ spacePledged: spacePledged.toString() });
  } catch (error) {
    console.error('Error fetching spacePledged on Mainnet:', error);
    res.status(500).json({ error: 'Failed to fetch space pledged' });
  }
}
