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
    return res.status(400).json({ error: 'Adresse manquante.' });
  }

  try {
    // Connexion au mainnet
    const api = await activate({ provider: 'wss://rpc.mainnet.subspace.foundation/ws' });

    // Récupération du solde
    const accountBalance = await balance(api, address);

    await api.disconnect();

    res.json({ balance: accountBalance.free.toString() });
  } catch (error) {
    console.error('Erreur lors de la récupération du solde:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du solde.' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur API en écoute sur http://localhost:${port}`);
});
