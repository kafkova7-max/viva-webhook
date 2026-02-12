export default function handler(req, res) {
  // Povolíme přístup robota Vivy
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  // Klíč musíme poslat jako prostý text v JSON formátu
  const response = { Key: "aazcbp9Jy8jLV0T7psc8eR9CV3AJ2U" };
  
  return res.status(200).end(JSON.stringify(response));
}
