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
  console.log('Received request to check balance for address:', address);

  if (!address) {
    console.log('Missing address in request');
    return res.status(400).json({ error: 'Missing address.' });
  }

  try {
    console.log("Connecting to the mainnet...");
    const api = await activate({ provider: 'wss://rpc.mainnet.subspace.foundation/ws' });
    console.log("Connected to the mainnet.");

    const accountBalance = await balance(api, address);
    console.log("Balance retrieved:", accountBalance);

    await api.disconnect();
    console.log("Disconnected from the mainnet.");

    // Conversion en AI3 (remplacez par une unité si besoin)
    const freeBalance = accountBalance.free ? accountBalance.free.toString() : 'N/A';
    res.json({ balance: freeBalance });
  } catch (error) {
    console.error('Error retrieving balance:', error);
    res.status(500).json({ error: 'Error retrieving balance.' });
  }
});

app.listen(port, () => {
  console.log(`Listening API server on http://localhost:${port}`);
});
