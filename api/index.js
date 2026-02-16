import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseUrl = 'https://rhthfrqbtpqvjtvsvqgs.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGhmcnFidHBxdmp0dnN2cWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTY0MDEsImV4cCI6MjA4NjQ5MjQwMX0.JHuIUiZGifcvfI9bFlx6hyT816VxpnI8jrmkknNNWcE'
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. DŮLEŽITÉ: Viva Payments Verification (potřebují Status 200 a Key)
  if (req.method === 'GET') {
    return res.status(200).json({ Key: "Verification success" });
  }

  if (req.method === 'POST') {
    const event = req.body

    // Pokud Viva posílá prázdný testovací POST pro ověření
    if (!event.OrderCode && !event.EventData) {
      return res.status(200).json({ Key: "Verification success" });
    }

    const orderCode = event.OrderCode || event.EventData?.OrderCode

    try {
      const { data, error } = await supabase
        .from('rides')
        .update({ 
          is_paid: true, 
          viva_transaction_id: String(event.EventData?.TransactionId || 'VIVA-LIVE') 
        })
        .eq('viva_order_code', String(orderCode))
        .select()

      if (error) throw error
      return res.status(200).json({ status: "Success" })
    } catch (dbError) {
      return res.status(500).json({ error: "DB Error" })
    }
  }

  return res.status(405).end()
}
