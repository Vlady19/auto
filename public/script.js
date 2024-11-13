// Fonction pour convertir le solde en AI3
function convertToAI3(balance) {
  const conversionFactor = 1.1163e17; // Essai avec un facteur de 1e18
  return (balance / conversionFactor).toFixed(4); // Garde 4 décimales
}

// Fonction pour vérifier le solde en utilisant l'adresse du portefeuille
async function fetchBalance() {
  const walletAddress = document.getElementById('walletAddress').value;

  if (!walletAddress) {
    alert('Veuillez entrer une adresse de portefeuille.');
    return;
  }

  try {
    // Appelle la fonction serverless sur Vercel au lieu de l'API directe
    const response = await fetch(`/api/getBalance?address=${walletAddress}`);
    const data = await response.json();

    if (data.balance) {
      const balanceInAI3 = convertToAI3(Number(data.balance)); // Convertit le solde brut en AI3
      document.getElementById('balanceDisplay').textContent = `Solde: ${balanceInAI3} AI3`;
    } else {
      document.getElementById('balanceDisplay').textContent = 'Erreur de récupération du solde';
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du solde:', error);
    document.getElementById('balanceDisplay').textContent = 'Erreur de récupération du solde';
  }
}

// Fonction existante pour l'espace utilisé
async function fetchSpacePledged() {
  try {
    const response = await fetch('/api/space-pledge');
    const data = await response.json();
    const bytes = BigInt(data.spacePledged);
    const pib = bytesToPiB(bytes);
    updateRocketPosition(pib);

    // Affiche la valeur Space Pledged
    document.getElementById('space-pledged').textContent = `Space Pledged: ${pib} PiB`;
  } catch (error) {
    console.error('Error fetching spacePledged:', error);
  }
}

// Convert bytes to PiB
function bytesToPiB(bytes) {
  const divisor = BigInt(1024 ** 5);
  const pib = Number(bytes) / Number(divisor);
  return pib.toFixed(3); // Keep 3 decimal places
}

// Update the rocket position and PiB display
function updateRocketPosition(pib) {
  const maxPiB = 20;
  const percentage = Math.min((pib / maxPiB) * 100, 100);
  
  const rocket = document.getElementById('rocket');
  rocket.style.left = percentage + '%';

  const pibValue = document.getElementById('pibValue');
  pibValue.textContent = `${pib} PiB out of 20 PiB`;
}

// Reset the rocket position
function resetRocket() {
  const rocket = document.getElementById('rocket');
  rocket.style.left = '0%';

  const pibValue = document.getElementById('pibValue');
  pibValue.textContent = '0 PiB out of 20 PiB';
}

// Fonction pour récupérer le Block Height via WebSocket
function fetchBlockHeight() {
  const socket = new WebSocket('wss://rpc.mainnet.subspace.foundation/ws');

  socket.onopen = function () {
    console.log('Connexion WebSocket établie pour Block Height');
  };

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    // Affiche Block Height si disponible
    if (data.blockHeight) {
      document.getElementById('block-height').textContent = `Block Height: ${data.blockHeight}`;
    }
  };

  socket.onerror = function (error) {
    console.error('Erreur WebSocket:', error);
  };

  socket.onclose = function () {
    console.log('Connexion WebSocket fermée');
  };
}

// Fetch and update Space Pledged every second
setInterval(fetchSpacePledged, 1000);

// Initial fetches
fetchSpacePledged();
fetchBlockHeight();
