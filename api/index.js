import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseUrl = 'https://rhthfrqbtpqvjtvsvqgs.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGhmcnFidHBxdmp0dnN2cWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTY0MDEsImV4cCI6MjA4NjQ5MjQwMX0.JHuIUiZGifcvfI9bFlx6hyT816VxpnI8jrmkknNNWcE'
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. UNIVERZÁLNÍ VERIFIKACE PRO VIVU
  if (req.method === 'GET') {
      return res.status(200).json({ "Key": "0B57C6C22A47B41688A7261CDD1F95483A545823" });
  }

  if (req.method === 'POST') {
    const event = req.body

    // Pokud je to jen ověřovací ping od Vivy (neobsahuje OrderCode)
    if (!event.OrderCode && !event.EventData) {
        return res.status(200).json({ "Key": "0B57C6C22A47B41688A7261CDD1F95483A545823" });
    }

    const orderCode = event.OrderCode || event.EventData?.OrderCode

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
      return res.status(200).json({ status: "Success" })
    } catch (dbError) {
      return res.status(500).json({ error: "Database error" })
    }
  }

  return res.status(405).end()
}
