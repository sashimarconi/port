
import { getAllOrders } from './db.js';

  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }
  try {
    const orders = getAllOrders();
    // Gera HTML simples
    let html = `<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8"><title>Admin - Pedidos</title>
    <style>body{font-family:sans-serif;background:#222;color:#eee;padding:32px;}table{border-collapse:collapse;width:100%;margin-top:24px;}th,td{border:1px solid #444;padding:8px;}th{background:#333;}tr:nth-child(even){background:#292929;}h1{color:#fe2c55;}code{color:#fe2c55;}</style></head><body><h1>Pedidos Recebidos</h1>`;
    if (!orders.length) {
      html += '<p>Nenhum pedido registrado ainda.</p>';
    } else {
      html += '<table><tr><th>ID</th><th>Status</th><th>Cliente</th><th>Valor</th><th>Data</th><th>Dados</th></tr>';
      for (const o of orders) {
        let raw = {};
        try { raw = JSON.parse(o.raw_payload); } catch(e) {}
        html += `<tr><td><code>${o.id||'-'}</code></td><td>${o.status||'-'}</td><td>${o.payer_name||'-'}<br>${o.payer_email||'-'}</td><td>${o.amount||'-'} ${o.currency||''}</td><td>${o.updatedAt ? new Date(o.updatedAt).toLocaleString() : '-'}</td><td><details><summary>Ver</summary><pre>${JSON.stringify(raw,null,2)}</pre></details></td></tr>`;
      }
      html += '</table>';
    }
    html += '</body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (err) {
    res.status(500).send('Erro ao carregar pedidos.');
  }
}
