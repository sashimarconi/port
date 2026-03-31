export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const body = req.body;
    console.log('WayMB webhook recebido:', JSON.stringify(body));

    // Validação básica do payload
    if (!body || !body.id || !body.status) {
      return res.status(400).json({ error: 'Payload inválido' });
    }

    // Exemplo: processar confirmação de pagamento
    if (body.status === 'COMPLETED') {
      // Aqui você deve atualizar o status do pedido/transação no seu sistema
      // Exemplo:
      // await updateOrderStatus(body.id, 'paid');
      console.log(`Pagamento confirmado para transação ${body.id}`);
      // Você pode adicionar outras ações, como enviar e-mail, liberar produto, etc.
    } else {
      // Outros status: apenas logar
      console.log(`Status recebido para transação ${body.id}: ${body.status}`);
    }

    res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error('Erro ao processar webhook:', err);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
}
