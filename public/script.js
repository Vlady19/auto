// Fonction pour convertir le solde en AI3
function convertToAI3(balance) {
  const conversionFactor = 1.1163e17;
  return (balance / conversionFactor).toFixed(4);
}
import { formatSpaceToDecimal } from '@autonomys/auto-consensus/utils/format';

// Fonction pour vérifier le solde en utilisant l'adresse du portefeuille
async function fetchBalance() {
  const walletAddress = document.getElementById('walletAddress').value;

  if (!walletAddress) {
    alert('Veuillez entrer une adresse de portefeuille.');
    return;
  }

  try {
    const response = await fetch(`/api/getBalance?address=${walletAddress}`);
    const data = await response.json();

    if (data.balance) {
      const balanceInAI3 = convertToAI3(Number(data.balance));
      document.getElementById('balanceDisplay').textContent = `Balance: ${balanceInAI3} AI3`;
    } else {
      document.getElementById('balanceDisplay').textContent = 'Erreur de récupération du solde';
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du solde:', error);
    document.getElementById('balanceDisplay').textContent = 'Erreur de récupération du solde';
  }
}

// Fonction pour récupérer l'espace utilisé et le block height
async function fetchSpacePledged() {
  try {
    const response = await fetch('/api/space-pledge');
    const data = await response.json();

    if (data.spacePledged && data.blockHeight) {
      // Conversion de BigInt en nombre pour utiliser la fonction de formatage
      const spacePledgedNumber = parseInt(data.spacePledged.toString(), 10);

      // Formater l'espace en PB (pétabytes) au format décimal
      const formattedSpacePledged = formatSpaceToDecimal(spacePledgedNumber, 2);

      const blockHeight = data.blockHeight;
      updateRocketPosition(formattedSpacePledged, blockHeight);
    } else {
      console.error('Données manquantes dans la réponse de /api/space-pledge');
    }
  } catch (error) {
    console.error('Error fetching spacePledged:', error);
  }
}


// Convert bytes to PiB
function bytesToPiB(bytes) {
  const divisor = BigInt(1024 ** 5);
  const pib = Number(bytes) / Number(divisor);
  return pib.toFixed(3);
}

// Fonction pour mettre à jour la position de la fusée et le texte des blocs traités
function updateRocketPosition(formattedSpacePledged, blockHeight) {
  const maxPB = 600; // Limite de 600 PB au lieu de 600 PiB pour l'exemple
  const percentage = Math.min((formattedSpacePledged / maxPB) * 100, 100);

  const rocket = document.getElementById('rocket');
  rocket.style.left = percentage + '%';

  const rainbow = document.getElementById('rainbow');
  rainbow.style.width = percentage + '%';

  const pibValue = document.getElementById('pibValue');
  pibValue.innerHTML = `${formattedSpacePledged} PB out of 600 PB`;

  const blockHeightDisplay = document.getElementById('blockHeight');
  blockHeightDisplay.textContent = `Processed Blocks: ${blockHeight}`;
}


// Reset function
function resetRocket() {
  const rocket = document.getElementById('rocket');
  rocket.style.left = '0%';

  const pibValue = document.getElementById('pibValue');
  pibValue.textContent = '0 PiB out of 600 PiB';

  const blockHeightDisplay = document.getElementById('blockHeight');
  blockHeightDisplay.textContent = 'Processed Blocks: N/A';
}

// Appel initial et intervalle
fetchSpacePledged();
setInterval(fetchSpacePledged, 1000);
