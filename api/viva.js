export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.status(200).json({
    Key: "aazcbp9Jy8jLV0T7psc8eR9CV3AJ2U"
  });
}
