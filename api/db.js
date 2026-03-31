// db.js
// Banco de dados serverless para Vercel usando SQLite via better-sqlite3-on-vercel
// https://github.com/ryanccn/better-sqlite3-on-vercel

import Database from 'better-sqlite3';
import path from 'path';

// O banco de dados será armazenado em /tmp (escrita permitida em serverless)
const dbPath = path.join('/tmp', 'orders.db');
const db = new Database(dbPath);

db.exec(`CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  status TEXT,
  amount TEXT,
  currency TEXT,
  payer_name TEXT,
  payer_email TEXT,
  raw_payload TEXT,
  updatedAt INTEGER
)`);

export function upsertOrder(order) {
  db.prepare(`INSERT INTO orders (id, status, amount, currency, payer_name, payer_email, raw_payload, updatedAt)
    VALUES (@id, @status, @amount, @currency, @payer_name, @payer_email, @raw_payload, @updatedAt)
    ON CONFLICT(id) DO UPDATE SET
      status=excluded.status,
      amount=excluded.amount,
      currency=excluded.currency,
      payer_name=excluded.payer_name,
      payer_email=excluded.payer_email,
      raw_payload=excluded.raw_payload,
      updatedAt=excluded.updatedAt
  `).run({
    id: order.id,
    status: order.status,
    amount: order.amount || '',
    currency: order.currency || '',
    payer_name: order.payer?.name || '',
    payer_email: order.payer?.email || '',
    raw_payload: JSON.stringify(order),
    updatedAt: Date.now()
  });
}

export function getAllOrders() {
  return db.prepare('SELECT * FROM orders ORDER BY updatedAt DESC').all();
}
