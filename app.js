import express from 'express';
import { ApiPromise, WsProvider } from '@polkadot/api';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors()); // Activer CORS pour éviter les blocages du navigateur
app.use(express.static('public')); // Assurer que les fichiers statiques dans 'public' sont accessibles

// Route pour récupérer le dernier bloc et l'espace promis
app.get('/api/space-pledge', async (req, res) => {
  try {
    const wsProvider = new WsProvider('wss://rpc-0.gemini-3h.subspace.network/ws');
    const api = await ApiPromise.create({ provider: wsProvider });

    const lastBlock = await api.rpc.chain.getBlock();
    console.log('Dernier bloc:', lastBlock.block.header.number.toString());

    const spacePledged = await api.query.someModule.someMethod(); // Remplacez par l'API correcte
    const pibValue = spacePledged.toString(); // Conversion en PiB si nécessaire

    res.json({ spacePledged: pibValue, blockNumber: lastBlock.block.header.number.toString() });
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
  }
});

// Nouvelle route pour récupérer le solde d'un portefeuille
app.get('/api/balance', async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Adresse manquante.' });
  }

  try {
    const wsProvider = new WsProvider('wss://rpc.mainnet.subspace.foundation/ws'); // URL du Mainnet
    const api = await ApiPromise.create({ provider: wsProvider });

    // Récupérer le solde du compte
    const { data: { free: balance } } = await api.query.system.account(address);

    res.json({ balance: balance.toHuman() });
  } catch (error) {
    console.error('Erreur lors de la récupération du solde:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du solde.' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur API en écoute sur http://localhost:${port}`);
});
