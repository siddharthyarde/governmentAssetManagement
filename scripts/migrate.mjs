/**
 * GAMS Database Migration Runner
 * Connects directly to Supabase PostgreSQL using individual params
 * (avoids URL-encoding issues with special chars in the password).
 *
 * Usage:  node scripts/migrate.mjs
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

// ── Connection config (individual params — no URL encoding needed) ──────────
const client = new Client({
  host:     requireEnv('DB_HOST'),
  port:     Number(process.env.DB_PORT ?? '5432'),
  database: process.env.DB_NAME ?? 'postgres',
  user:     process.env.DB_USER ?? 'postgres',
  password: requireEnv('DB_PASSWORD'),
  ssl: { rejectUnauthorized: false },   // Supabase requires SSL
});

// ── Migration files to run in order ─────────────────────────────────────────
const migrations = [
  '../supabase/migrations/001_initial_schema.sql',
  '../supabase/migrations/002_storage_setup.sql',
  '../supabase/migrations/003_functions.sql',
  '../supabase/migrations/004_security_patches.sql',
];

async function run() {
  console.log('Connecting to Supabase PostgreSQL…');
  await client.connect();
  console.log('Connected.\n');

  for (const relPath of migrations) {
    const filePath = join(__dirname, relPath);
    const sql = readFileSync(filePath, 'utf8');

    console.log(`Running migration: ${relPath}`);
    try {
      await client.query(sql);
      console.log(`✓ ${relPath} applied successfully.\n`);
    } catch (err) {
      // If objects already exist, treat as idempotent warning, not fatal
      if (err.code === '42P07' || err.code === '42710' || err.code === '42P06') {
        console.warn(`⚠  Already exists (skipping): ${err.message}\n`);
      } else {
        console.error(`✗ Migration failed: ${err.message}`);
        console.error(`  Detail: ${err.detail || ''}`);
        console.error(`  Hint:   ${err.hint || ''}`);
        await client.end();
        process.exit(1);
      }
    }
  }

  await client.end();
  console.log('All migrations applied. Connection closed.');
}

run().catch(async (err) => {
  console.error('Fatal:', err.message);
  await client.end().catch(() => {});
  process.exit(1);
});
