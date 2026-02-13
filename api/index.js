import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // 1. Nastavení údajů (Vše už jsem ti připravil)
  const supabaseUrl = 'https://rhthfrqbtpqjtvsvqgs.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGhmcnFidHBxdmp0dnN2cWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTY0MDEsImV4cCI6MjA4NjQ5MjQwMX0.JHuIUiZGifcvfI9bFlx6hyT816VxpnI8jrmkknNNWcE'
  const supabase = createClient(supabaseUrl, supabaseKey)

  const merchantId = '5bd63d49-7027-405d-ab46-ded251aaf43d'
  const apiKey = 'aazcbp9Jy8jLV0T7psc8eR9CV3AJ2U'

  // 2. Ověření Webhooku (Viva se ptá na klíč)
  if (req.method === 'GET') {
    try {
      const credentials = Buffer.from(`${merchantId}:${apiKey}`).toString('base64')
      const response = await fetch("https://www.vivapayments.com/api/messages/config/token", {
        method: "GET",
        headers: { "Authorization": `Basic ${credentials}` }
      })
      const data = await response.json()
      return res.status(200).json({ Key: data.Key })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }

  // 3. Zpracování PLATBY (Viva posílá info o penězích)
  if (req.method === 'POST') {
    const event = req.body
    
    // Pokud je platba úspěšná (StatusId 10)
    if (event.StatusId === 'F' || event.EventTypeId === 179) { 
      const transactionId = event.EventData.TransactionId
      const orderCode = event.EventData.OrderCode

      // Zapíšeme do Supabase, že je hotovo
      const { data, error } = await supabase
        .from('Rides')
        .update({ is_paid: true, viva_transaction_id: transactionId })
        .eq('viva_order_code', orderCode) // Tohle spojí platbu se správnou jízdou

      return res.status(200).json({ received: true })
    }
  }

  res.status(405).send('Method Not Allowed')
}
