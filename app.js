import express from 'express';
import cors from 'cors';
import { activate } from '@autonomys/auto-utils';
import { balance } from '@autonomys/auto-consensus';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

// Route pour récupérer le solde d'un portefeuille
app.get('/api/balance', async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Missing address.' });
  }

  try {
    // Connexion au mainnet
    const api = await activate({ provider: 'wss://rpc.mainnet.subspace.foundation/ws' });

    // Récupération du solde
    const accountBalance = await balance(api, address);

    await api.disconnect();

    res.json({ balance: accountBalance.free.toString() });
  } catch (error) {
    console.error('Error retrieving balance:', error);
    res.status(500).json({ error: 'Error retrieving balance.' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Listening API server on http://localhost:${port}`);
});
