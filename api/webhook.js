export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const body = req.body;
    console.log('WayMB webhook recebido:', JSON.stringify(body));
    // Aqui você pode adicionar lógica para processar o webhook
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
}
