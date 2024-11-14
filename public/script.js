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

function updateRocketPosition(pib, blockHeight) {
  const maxPiB = 600;
  const percentage = Math.min((pib / maxPiB) * 100, 100);

  const rocket = document.getElementById('rocket');
  rocket.style.left = percentage + '%';

  // Ajustement de la largeur de l'arc-en-ciel en fonction de la progression de la fusée
  const rainbow = document.getElementById('rainbow');
  rainbow.style.width = percentage + '%';

  const pibValue = document.getElementById('pibValue');
  const percentageText = `${percentage.toFixed(2)}%`;
  pibValue.innerHTML = `${pib} PiB out of 600 PiB &nbsp;&nbsp;&nbsp; <span class="percentage">${percentageText}</span>`;

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

// Import or define the format functions
// Binary format (powers of 2)
const formatSpaceToBinary = (value, decimals = 2) => {
  if (value === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(value) / Math.log(k))

  return parseFloat((value / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Decimal format (powers of 10)
const formatSpaceToDecimal = (value, decimals = 2) => {
  if (value === 0) return '0 Bytes'

  const k = 1000
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(value) / Math.log(k))

  return parseFloat((value / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Function to fetch and format space pledged
async function fetchSpacePledged() {
  try {
    const response = await fetch('/api/space-pledge');
    const data = await response.json();

    // Convert spacePledged from bigint to number for formatting
    const spacePledgedNumber = parseInt(data.spacePledged.toString());

    // Format using decimal format (you can use binary if needed)
    const formattedSpacePledged = formatSpaceToDecimal(spacePledgedNumber, 2);
    
    document.getElementById('spacePledgedDisplay').textContent = `Space Pledged: ${formattedSpacePledged}`;
  } catch (error) {
    console.error('Error fetching spacePledged:', error);
  }
}

// Call the function to display the formatted space pledge
fetchSpacePledged();


// Fetch and update every second
setInterval(fetchSpacePledged, 1000);

// Initial fetch
fetchSpacePledged();
