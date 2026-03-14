/**
 * GAMS Seed Runner
 * Inserts sample data into the Supabase database.
 *
 * Usage:  node scripts/seed.mjs
 *
 * Before running:
 *   1. Create users in Supabase Dashboard → Authentication → Users
 *   2. Paste their UUIDs into supabase/seed.sql (v_admin_id etc.)
 *   3. Run:  node scripts/seed.mjs
 */

import pg from 'pg';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const client = new Client({
  host:     requireEnv('DB_HOST'),
  port:     Number(process.env.DB_PORT ?? '5432'),
  database: process.env.DB_NAME ?? 'postgres',
  user:     process.env.DB_USER ?? 'postgres',
  password: requireEnv('DB_PASSWORD'),
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('Connecting to Supabase PostgreSQL…');
  await client.connect();
  console.log('Connected.\n');

  const sqlPath = join(__dirname, '../supabase/seed.sql');
  const sql = readFileSync(sqlPath, 'utf8');

  console.log('Running seed.sql…');
  try {
    await client.query(sql);
    console.log('✓ Seed data inserted successfully.\n');
  } catch (err) {
    console.error('✗ Seed failed:', err.message);
    console.error('  Detail:', err.detail ?? '');
    console.error('  Hint:  ', err.hint ?? '');
  }

  await client.end();
  console.log('Connection closed.');
}

run().catch(console.error);
