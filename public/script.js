// Fonction pour convertir le solde en AI3
function convertToAI3(balance) {
  const conversionFactor = 1.1163e17;
  return (balance / conversionFactor).toFixed(4);
}

// Fonction pour vérifier le solde du portefeuille
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

// Fonctions de formatage
const formatSpaceToBinary = (value, decimals = 2) => {
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const i = Math.floor(Math.log(value) / Math.log(k));
  return parseFloat((value / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatSpaceToDecimal = (value, decimals = 2) => {
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(value) / Math.log(k));
  return parseFloat((value / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Fonction pour récupérer et mettre à jour l'espace utilisé et la hauteur de bloc
async function fetchSpacePledged() {
  try {
    const response = await fetch('/api/space-pledge');
    const data = await response.json();

    const spacePledgedNumber = parseInt(data.spacePledged.toString());
    const formattedSpacePledged = formatSpaceToDecimal(spacePledgedNumber, 2);

    document.getElementById('spacePledgedDisplay').textContent = `Space Pledged: ${formattedSpacePledged}`;
    document.getElementById('blockHeightDisplay').textContent = `Processed Blocks: ${data.blockHeight || 'N/A'}`;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'espace pledge:', error);
  }
}

// Première récupération et mise à jour toutes les secondes
fetchSpacePledged();
setInterval(fetchSpacePledged, 1000);
