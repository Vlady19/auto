// Fonction pour convertir le solde en AI3
function convertToAI3(balance) {
  return Number(balance).toFixed(0);
}

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
      const balanceInAI3 = convertToAI3(data.balance);
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
  const rainbow = document.getElementById('rainbow');

  // Applique le pourcentage à la fusée
  rocket.style.left = percentage + '%';

  // Applique le pourcentage à l'arc-en-ciel avec un léger décalage pour rattraper
  rainbow.style.width = (parseFloat(percentage) + 1) + '%'; // Ajouter un pourcentage supplémentaire

  const pibValue = document.getElementById('pibValue');
  pibValue.innerHTML = `${pib} PB out of 600 PB &nbsp;&nbsp;&nbsp; <span class="percentage">${percentage}%</span>`;

  const blockHeightDisplay = document.getElementById('blockHeight');
  blockHeightDisplay.textContent = `Processed Blocks: ${blockHeight}`;
}

// Reset function
function resetRocket() {
  const rocket = document.getElementById('rocket');
  const rainbow = document.getElementById('rainbow');

  // Remet les deux éléments à zéro
  rocket.style.left = '0%';
  rainbow.style.width = '0%';

  const pibValue = document.getElementById('pibValue');
  pibValue.textContent = '0 PB out of 600 PB';

  const blockHeightDisplay = document.getElementById('blockHeight');
  blockHeightDisplay.textContent = 'Processed Blocks: N/A';
}

// Appel initial et intervalle pour mettre à jour toutes les secondes
fetchSpacePledged();
setInterval(fetchSpacePledged, 1000);
