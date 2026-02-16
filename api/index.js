import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // TATO URL MUSÍ BÝT 100% PŘESNĚ ZE SUPABASE SETTINGS -> API
const supabaseUrl = 'https://rhthfrqbtpqvjtvsvqgs.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGhmcnFidHBxdmp0dnN2cWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTY0MDEsImV4cCI6MjA4NjQ5MjQwMX0.JHuIUiZGifcvfI9bFlx6hyT816VxpnI8jrmkknNNWcE'
  
  const supabase = createClient(supabaseUrl, supabaseKey)

  if (req.method === 'POST') {
    const event = req.body
    const orderCode = event.OrderCode || event.EventData?.OrderCode

    if (!orderCode) {
      return res.status(400).json({ error: "Chybí OrderCode" })
    }

    try {
      const { data, error } = await supabase
        .from('rides')
        .update({ 
          is_paid: true, 
          viva_transaction_id: 'FINÁLNÍ-TEST-ÚSPĚCH' 
        })
        .eq('viva_order_code', String(orderCode))
        .select()

      if (error) throw error

      return res.status(200).json({ status: "Success", updated: data })
    } catch (dbError) {
      return res.status(500).json({ 
        error: "Supabase connection failed", 
        details: dbError.message 
      })
    }
  }

  return res.status(200).json({ message: "Server běží" })
}
