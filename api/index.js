export default async function handler(req, res) {
  // 1. Tvoje údaje z Viva.com
  const merchantId = '5bd63d49-7027-405d-ab46-ded251aaf43d'; 
  const apiKey = 'aazcbp9Jy8jLV0T7psc8eR9CV3AJ2U';

  // Nastavení hlaviček pro Vivu
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 2. Pokud Viva jen posílá potvrzení o platbě (POST), odpovíme OK
  if (req.method === 'POST') {
    return res.status(200).json({ message: 'ok' });
  }

  // 3. Ověření Webhooku (GET): Tvůj server si teď sám řekne Vivě o čerstvý klíč
  try {
    const credentials = Buffer.from(`${merchantId}:${apiKey}`).toString('base64');
    
    const response = await fetch("https://www.vivapayments.com/api/messages/config/token", {
      method: "GET",
      headers: {
        "Authorization": `Basic ${credentials}`,
      }
    });

    const data = await response.json();

    // Pošleme Vivě zpět ten klíč, který nám právě vygenerovala
    res.status(200).json({
      Key: data.Key
    });
  } catch (error) {
    res.status(500).json({ error: 'Chyba při komunikaci s Vivou' });
  }
}
