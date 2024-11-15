// Importation des modules nécessaires du SDK
import { Account } from '@autonomys/auto-consensus';

// Fonction pour convertir le solde en AI3
function convertToAI3(balance) {
  const conversionFactor = 1.1163e17;
  return (balance / conversionFactor).toFixed(4);
}

// Fonction pour vérifier le solde en utilisant l'Auto SDK
async function fetchBalance() {
  const walletAddress = document.getElementById('walletAddress').value;

  if (!walletAddress) {
    alert('Veuillez entrer une adresse de portefeuille.');
    return;
  }

  try {
    // Instanciation de l'objet Account avec l'adresse du portefeuille
    const account = new Account(walletAddress);

    // Récupération du solde avec le SDK
    const balance = await account.getBalance();

    // Conversion du solde si nécessaire (selon les besoins)
    const balanceInAI3 = convertToAI3(balance);
    document.getElementById('balanceDisplay').textContent = `Balance: ${balanceInAI3} AI3`;
  } catch (error) {
    console.error('Erreur lors de la récupération du solde avec Auto SDK:', error);
    document.getElementById('balanceDisplay').textContent = 'Erreur de récupération du solde';
  }
}

// Fonction pour récupérer l'espace utilisé et le block height
async function fetchSpacePledged() {
  try {
    const response = await fetch('/api/space-pledge');
    const data = await response.json();

    if (data.spacePledged && data.blockHeight !== undefined) {
      // Conversion de spacePledged de BigInt à un nombre pour le format PB
      const spacePledgedNumber = parseInt(data.spacePledged.toString(), 10);

      // Conversion en PB et calcul du pourcentage
      const spacePledgedPB = (spacePledgedNumber / 1e15).toFixed(2); // Conversion en PB avec 2 décimales
      const maxPB = 600;
      const percentage = Math.min((spacePledgedPB / maxPB) * 100, 100).toFixed(2); // Limite à 100%

      // Mise à jour des éléments HTML et de la position de la fusée
      updateRocketPosition(spacePledgedPB, percentage, data.blockHeight);
    } else {
      console.error('Données manquantes dans la réponse de /api/space-pledge');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
  }
}

// Fonction pour mettre à jour la position de la fusée, l'arc-en-ciel, et le texte des blocs traités
function updateRocketPosition(pib, percentage, blockHeight) {
  const rocket = document.getElementById('rocket');
  rocket.style.left = percentage + '%';

  // Ajustez la largeur de l'arc-en-ciel pour qu'il suive la fusée
  const rainbow = document.getElementById('rainbow');
  rainbow.style.left = '0';
  rainbow.style.width = percentage + '%';

  const pibValue = document.getElementById('pibValue');
  pibValue.innerHTML = `${pib} PB out of 600 PB &nbsp;&nbsp;&nbsp; <span class="percentage">${percentage}%</span>`;

  const blockHeightDisplay = document.getElementById('blockHeight');
  blockHeightDisplay.textContent = `Processed Blocks: ${blockHeight}`;
}

// Fonction de réinitialisation de la fusée et des éléments
function resetRocket() {
  const rocket = document.getElementById('rocket');
  rocket.style.left = '0%';

  const pibValue = document.getElementById('pibValue');
  pibValue.textContent = '0 PB out of 600 PB';

  const blockHeightDisplay = document.getElementById('blockHeight');
  blockHeightDisplay.textContent = 'Processed Blocks: N/A';
}

// Appel initial et intervalle pour mettre à jour toutes les secondes
fetchSpacePledged();
setInterval(fetchSpacePledged, 1000);

// Associer le bouton "Check balance" pour lancer la vérification du solde
document.getElementById('checkBalanceButton').addEventListener('click', fetchBalance);
