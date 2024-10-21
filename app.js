import express from 'express';
import { ApiPromise, WsProvider } from '@polkadot/api';
import cors from 'cors'; // Ajoutez cette ligne pour éviter les problèmes de CORS

const app = express();
const port = 3000;

app.use(cors()); // Activer CORS pour éviter les blocages du navigateur

// Serveur de fichiers statiques pour l'interface web
app.use(express.static('public'));

// Récupération du dernier bloc et de l'espace promis
app.get('/api/space-pledge', async (req, res) => {
  try {
    const wsProvider = new WsProvider('wss://rpc-0.gemini-3h.subspace.network/ws');
    const api = await ApiPromise.create({ provider: wsProvider });

    const lastBlock = await api.rpc.chain.getBlock();
    console.log('Dernier bloc:', lastBlock.block.header.number.toString());

    // Ici on récupère l'espace promis (remplacez 'spacePledge.total()' par la bonne méthode)
    const spacePledged = await api.query.someModule.someMethod(); // Remplacez par l'API correcte
    const pibValue = spacePledged.toString(); // Conversion en PiB si nécessaire

    res.json({ spacePledged: pibValue, blockNumber: lastBlock.block.header.number.toString() });
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur API en écoute sur http://localhost:${port}`);
});

