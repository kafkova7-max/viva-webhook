import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseUrl = 'https://rhthfrqbtpqvjtvsvqgs.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGhmcnFidHBxdmp0dnN2cWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTY0MDEsImV4cCI6MjA4NjQ5MjQwMX0.JHuIUiZGifcvfI9bFlx6hyT816VxpnI8jrmkknNNWcE'
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. DŮLEŽITÉ PRO VIVU: Odpověď na verifikační požadavek
  if (req.method === 'GET' || (req.method === 'POST' && !req.body.OrderCode && !req.body.EventData)) {
    return res.status(200).json({ status: "OK", message: "Webhook is active" });
  }

  // 2. ZPRACOVÁNÍ REÁLNÉ PLATBY
  if (req.method === 'POST') {
    const event = req.body
    const orderCode = event.OrderCode || event.EventData?.OrderCode

    if (!orderCode) {
      // Pokud Viva posílá jen testovací ping, vrátíme 200 místo 400
      return res.status(200).json({ status: "Verification successful" });
    }

    try {
      const { data, error } = await supabase
        .from('rides')
        .update({ 
          is_paid: true, 
          viva_transaction_id: String(event.EventData?.TransactionId || 'VIVA-PAYMENT') 
        })
        .eq('viva_order_code', String(orderCode))
        .select()

      if (error) throw error
      return res.status(200).json({ status: "Success", updated: data })
    } catch (dbError) {
      return res.status(500).json({ error: "Supabase connection failed", details: dbError.message })
    }
  }

  return res.status(405).json({ error: "Method not allowed" })
}
