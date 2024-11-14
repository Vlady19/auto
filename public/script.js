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
      document.getElementById('balanceDisplay').textContent = `Solde: ${balanceInAI3} AI3`;
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
    const bytes = BigInt(data.spacePledged);
    const blockHeight = data.blockHeight; // Supposons que `blockHeight` est inclus dans la réponse API
    const pib = bytesToPiB(bytes);
    updateRocketPosition(pib, blockHeight); // Passer le block height à la fonction
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

// Mettre à jour la position de la fusée, l'affichage PiB, et le block height
function updateRocketPosition(pib, blockHeight) {
  const maxPiB = 600;
  const percentage = Math.min((pib / maxPiB) * 100, 100);

  const rocket = document.getElementById('rocket');
  rocket.style.left = percentage + '%';

  const pibValue = document.getElementById('pibValue');
  const percentageText = `${percentage.toFixed(2)}%`; // Calcul du pourcentage avec 2 décimales
  pibValue.innerHTML = `${pib} PiB out of 600 PiB &nbsp;&nbsp;&nbsp; <span class="percentage">${percentageText}</span>`;

  // Affiche le block height du côté gauche
  const blockHeightDisplay = document.getElementById('blockHeight');
  blockHeightDisplay.textContent = `Processed Blocks: ${blockHeight}`;
}


// Reset the rocket position
function resetRocket() {
  const rocket = document.getElementById('rocket');
  rocket.style.left = '0%';

  const pibValue = document.getElementById('pibValue');
  pibValue.textContent = '0 PiB out of 600 PiB';

  const blockHeightDisplay = document.getElementById('blockHeight');
  blockHeightDisplay.textContent = 'Processed Blocks: N/A';
}

// Fetch and update every second
setInterval(fetchSpacePledged, 1000);

// Initial fetch
fetchSpacePledged();
