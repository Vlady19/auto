// netlify/functions/space-pledge.js

exports.handler = async function(event, context) {
  const spacePledged = BigInt(8 * 1024 ** 5);  // Simule 8 PiB
  return {
    statusCode: 200,
    body: JSON.stringify({ spacePledged: spacePledged.toString() }),
  };
};

