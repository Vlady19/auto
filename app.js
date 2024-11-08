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
    // Activer l'API avec le bon réseau (mettez à jour networkId si nécessaire)
    const api = await activate({ networkId: 'gemini-3h' });

    // Récupérer le solde du compte
    const accountBalance = await balance(api, address);

    // Déconnecter une fois terminé pour libérer les ressources
    await api.disconnect();

    // Envoyer le solde sous format JSON
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
