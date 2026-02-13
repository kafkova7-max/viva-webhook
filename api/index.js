import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseUrl = 'https://rhthfrqbtpqjtvsvqgs.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGhmcnFidHBxdmp0dnN2cWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTY0MDEsImV4cCI6MjA4NjQ5MjQwMX0.JHuIUiZGifcvfI9bFlx6hyT816VxpnI8jrmkknNNWcE'
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. Ověření pro Vivu (Pouští se jen při GET požadavku)
  if (req.method === 'GET') {
    try {
      const merchantId = '5bd63d49-7027-405d-ab46-ded251aaf43d'
      const apiKey = 'aazcbp9Jy8jLV0T7psc8eR9CV3AJ2U'
      const credentials = Buffer.from(`${merchantId}:${apiKey}`).toString('base64')
      
      const response = await fetch("https://www.vivapayments.com/api/messages/config/token", {
        method: "GET",
        headers: { "Authorization": `Basic ${credentials}` }
      })
      const data = await response.json()
      return res.status(200).json({ Key: data.Key })
    } catch (e) {
      // Pokud fetch selže, aspoň nezhroutíme celý server
      return res.status(200).json({ status: "GET mode active, fetch skipped for test" })
    }
  }

  // 2. Zpracování platby (POST) - TADY PROBÍHÁ TVŮJ TEST
  if (req.method === 'POST') {
    const event = req.body
    
    // Získáme data z testu v ReqBinu
    const orderCode = event.EventData?.OrderCode || event.OrderCode
    const transactionId = event.EventData?.TransactionId || "TEST-ID"

    if (!orderCode) {
      return res.status(400).json({ error: "Chybí OrderCode v datech" })
    }

    // Zkusíme aktualizovat Supabase
    const { data, error } = await supabase
      .from('Rides') 
      .update({ 
        is_paid: true, 
        viva_transaction_id: String(transactionId) 
      })
      .eq('viva_order_code', String(orderCode))
      .select() // Tohle nám vrátí, jestli se něco změnilo

    if (error) {
      return res.status(500).json({ error: error.message, details: "Chyba v Supabase" })
    }

    return res.status(200).json({ 
      received: true, 
      message: "Databáze aktualizována!", 
      updated_code: orderCode,
      db_response: data 
    })
  }

  res.status(405).send('Použij POST nebo GET')
}
