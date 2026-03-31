
import { upsertOrder } from './db.js';

  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ok' });
  }
  try {
    const body = req.body;
    console.log('WayMB webhook recebido:', JSON.stringify(body));
    if (body && body.id && body.status) {
      upsertOrder(body);
      console.log(`Transação ${body.id} salva/atualizada no banco.`);
    } else {
      console.warn('Webhook recebido com payload incompleto:', body);
    }
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Erro ao processar webhook:', err);
    res.status(200).json({ status: 'ok' });
  }
}
