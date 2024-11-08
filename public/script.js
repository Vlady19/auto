// Function to fetch the spacePledged value
async function fetchSpacePledged() {
  try {
    const response = await fetch('/api/space-pledge');  // Utilise le chemin de l'API serverless
    const data = await response.json();
    const bytes = BigInt(data.spacePledged);
    const pib = bytesToPiB(bytes);
    updateRocketPosition(pib);
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

// Fetch and update every second
setInterval(fetchSpacePledged, 1000);

// Initial fetch
fetchSpacePledged();

// Fonction pour vérifier le solde en utilisant l'adresse du portefeuille NEEEEEEEEEEEEEEW
async function fetchBalance() {
  const walletAddress = document.getElementById('walletAddress').value;

  if (!walletAddress) {
    alert('Veuillez entrer une adresse de portefeuille.');
    return;
  }

  try {
    const response = await fetch(`/api/balance?address=${walletAddress}`);
    const data = await response.json();

    if (data.balance) {
      document.getElementById('balanceDisplay').textContent = `Solde: ${data.balance}`;
    } else {
      document.getElementById('balanceDisplay').textContent = 'Erreur de récupération du solde';
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du solde:', error);
    document.getElementById('balanceDisplay').textContent = 'Erreur de récupération du solde';
  }
}
