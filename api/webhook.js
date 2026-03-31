import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ok' });
  }
  try {
    const body = req.body;
    console.log('WayMB webhook recebido:', JSON.stringify(body));

    // Salvar transação recebida em orders.json
    if (body && body.id && body.status) {
      const ordersPath = path.join(process.cwd(), 'api', 'orders.json');
      let orders = [];
      try {
        const data = await fs.readFile(ordersPath, 'utf-8');
        orders = JSON.parse(data);
      } catch (e) {}
      // Atualiza se já existe, senão adiciona
      const idx = orders.findIndex(o => o.id === body.id);
      if (idx >= 0) {
        orders[idx] = { ...orders[idx], ...body, updatedAt: Date.now() };
      } else {
        orders.push({ ...body, updatedAt: Date.now() });
      }
      await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2));
      console.log(`Transação ${body.id} salva/atualizada.`);
    } else {
      console.warn('Webhook recebido com payload incompleto:', body);
    }
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Erro ao processar webhook:', err);
    res.status(200).json({ status: 'ok' });
  }
}
