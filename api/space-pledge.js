import { spacePledge } from '@autonomys/auto-consensus';
import { activate } from '@autonomys/auto-utils';

// Activate the API and make sure it's ready to be used
let api;

(async () => {
  try {
    api = await activate();
    console.log('API activated successfully.');
  } catch (error) {
    console.error('Error activating API:', error);
  }
})();

export default async function handler(req, res) {
  try {
    if (!api) {
      return res.status(503).json({ error: 'API not ready yet' });
    }

    // Fetch the spacePledged value from the blockchain
    const spacePledged = await spacePledge(api);

    // Send the spacePledged value as a string in the response
    res.status(200).json({ spacePledged: spacePledged.toString() });
  } catch (error) {
    console.error('Error fetching spacePledged:', error);
    res.status(500).json({ error: 'Failed to fetch space pledged' });
  }
}
