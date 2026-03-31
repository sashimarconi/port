import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }
  try {
    const ordersPath = path.join(process.cwd(), 'api', 'orders.json');
    let orders = [];
    try {
      const data = await fs.readFile(ordersPath, 'utf-8');
      orders = JSON.parse(data);
    } catch (e) {}

    // Gera HTML simples
    let html = `<!DOCTYPE html><html lang="pt"><head><meta charset="UTF-8"><title>Admin - Pedidos</title>
    <style>body{font-family:sans-serif;background:#222;color:#eee;padding:32px;}table{border-collapse:collapse;width:100%;margin-top:24px;}th,td{border:1px solid #444;padding:8px;}th{background:#333;}tr:nth-child(even){background:#292929;}h1{color:#fe2c55;}code{color:#fe2c55;}</style></head><body><h1>Pedidos Recebidos</h1>`;
    if (!orders.length) {
      html += '<p>Nenhum pedido registrado ainda.</p>';
    } else {
      html += '<table><tr><th>ID</th><th>Status</th><th>Cliente</th><th>Valor</th><th>Data</th><th>Dados</th></tr>';
      for (const o of orders.reverse()) {
        html += `<tr><td><code>${o.id||'-'}</code></td><td>${o.status||'-'}</td><td>${o.payer?.name||'-'}<br>${o.payer?.email||'-'}</td><td>${o.amount||'-'} ${o.currency||''}</td><td>${o.updatedAt ? new Date(o.updatedAt).toLocaleString() : '-'}</td><td><details><summary>Ver</summary><pre>${JSON.stringify(o,null,2)}</pre></details></td></tr>`;
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
