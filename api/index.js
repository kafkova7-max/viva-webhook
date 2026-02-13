import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Inicializace Supabase
  const supabaseUrl = 'https://rhthfrqbtpqjtvsvqgs.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJodGhmcnFidHBxdmp0dnN2cWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTY0MDEsImV4cCI6MjA4NjQ5MjQwMX0.JHuIUiZGifcvfI9bFlx6hyT816VxpnI8jrmkknNNWcE'
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Pokud někdo jen otevře stránku (GET)
  if (req.method === 'GET') {
    return res.status(200).json({ status: "Server běží", message: "Čekám na POST data z ReqBin nebo Vivy" });
  }

  // Zpracování PLATBY (POST)
  if (req.method === 'POST') {
    const event = req.body;
    
    // Vytáhneme kód objednávky (podpora pro různé formáty dat)
    const orderCode = event.EventData?.OrderCode || event.OrderCode || event.orderCode;

    if (!orderCode) {
      return res.status(400).json({ error: "V datech chybí OrderCode!" });
    }

    // UPDATE v databázi
    const { data, error } = await supabase
      .from('rides') // Ujisti se, že v Supabase je to 'rides' malými!
      .update({ 
        is_paid: true, 
        viva_transaction_id: "TEST-SUCCES-123" 
      })
      .eq('viva_order_code', String(orderCode))
      .select();

    if (error) {
      return res.status(500).json({ error: "Supabase error", details: error.message });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Jízda byla označena jako zaplacená!", 
      updatedData: data 
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
