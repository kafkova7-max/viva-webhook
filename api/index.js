import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(
    'https://rhthfrqbtpqjtvsvqgs.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGhmcnFidHBxdmp0dnN2cWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTY0MDEsImV4cCI6MjA4NjQ5MjQwMX0.JHuIUiZGifcvfI9bFlx6hyT816VxpnI8jrmkknNNWcE'
  )

  if (req.method === 'POST') {
    const event = req.body
    const orderCode = event.EventData?.OrderCode || event.OrderCode
    const transactionId = event.EventData?.TransactionId || "TEST-SUCCESS"

    // Tady to musí být 'rides' malým písmem!
    const { data, error } = await supabase
      .from('rides') 
      .update({ is_paid: true, viva_transaction_id: String(transactionId) })
      .eq('viva_order_code', String(orderCode))
      .select()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ status: "Success", updated: data })
  }

  res.status(200).json({ message: "Server is running" })
}
