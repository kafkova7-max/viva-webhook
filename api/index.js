export default function handler(req, res) {
  // Povolíme všechno, co by Viva mohla chtít
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Pokud Viva jen "zkouší" spojení (OPTIONS), hned jí odpovíme OK
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Pošleme klíč v čistém JSON formátu
  res.status(200).json({
    Key: "aazcbp9Jy8jLV0T7psc8eR9CV3AJ2U"
  });
}
