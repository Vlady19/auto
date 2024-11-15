// Fonction pour convertir le solde en AI3
function convertToAI3(balance) {
  const conversionFactor = 1.1163e17;
  return (balance / conversionFactor).toFixed(4);
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

  // Ajustez la largeur de l'arc-en-ciel pour qu'il soit légèrement en avance par rapport à la fusée
  const rainbow = document.getElementById('rainbow');
  rainbow.style.left = '0'; // Assurez-vous que l'arc-en-ciel commence au début du chemin
  rainbow.style.width = (parseFloat(percentage) + 2) + '%'; // Ajout d'un léger décalage de 2%

  const pibValue = document.getElementById('pibValue');
  pibValue.innerHTML = `${pib} PB out of 600 PB &nbsp;&nbsp;&nbsp; <span class="percentage">${percentage}%</span>`;

  const blockHeightDisplay = document.getElementById('blockHeight');
  blockHeightDisplay.textContent = `Processed Blocks: ${blockHeight}`;
}





// Reset function
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
