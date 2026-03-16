/**
 * GAMS Event Seed Script
 * Usage: node scripts/seed-events.mjs
 */
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'db.tngrjxbzamkrdkwpyqel.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'xQSUt9WPdwgDYefQ',
  ssl: { rejectUnauthorized: false },
});

const ADMIN_ID = 'a4274b54-f3b5-41fa-8c87-a188f52b003c';

const EVENTS = [
  {
    event_code: 'EVT-2026-001',
    name: 'National Technology Summit 2026',
    event_type: 'national_celebration',
    gov_level: 'central',
    organising_ministry: 'Ministry of Electronics and IT',
    venue: 'Bharat Mandapam, New Delhi',
    state_code: 'DL',
    district: 'New Delhi',
    start_date: '2026-03-20',
    end_date: '2026-03-22',
    expected_footfall: 5000,
    status: 'approved',
    description: 'Annual national technology summit organised by MeitY to showcase Digital India initiatives.',
  },
  {
    event_code: 'EVT-2026-002',
    name: 'Vibrant India Trade Fair 2026',
    event_type: 'exhibition',
    gov_level: 'state',
    organising_ministry: 'Ministry of Commerce and Industry',
    venue: 'MMRDA Grounds, Bandra Kurla Complex',
    state_code: 'MH',
    district: 'Mumbai',
    start_date: '2026-04-05',
    end_date: '2026-04-10',
    expected_footfall: 25000,
    status: 'assets_requested',
    description: 'Large-scale trade exhibition to promote Indian exports and MSME sector.',
  },
  {
    event_code: 'EVT-2026-003',
    name: 'National Sports Games — Phase 2',
    event_type: 'sports',
    gov_level: 'central',
    organising_ministry: 'Ministry of Youth Affairs and Sports',
    venue: 'Jawaharlal Nehru Stadium Complex',
    state_code: 'DL',
    district: 'New Delhi',
    start_date: '2026-03-15',
    end_date: '2026-03-28',
    expected_footfall: 40000,
    status: 'ongoing',
    description: 'Second phase of National Sports Games featuring track & field, badminton, and wrestling.',
  },
  {
    event_code: 'EVT-2026-004',
    name: 'Agri Connect India 2026',
    event_type: 'exhibition',
    gov_level: 'state',
    organising_ministry: 'Ministry of Agriculture and Farmers Welfare',
    venue: 'Parade Ground, Sector 17',
    state_code: 'HR',
    district: 'Chandigarh',
    start_date: '2026-05-01',
    end_date: '2026-05-04',
    expected_footfall: 12000,
    status: 'draft',
    description: 'Agricultural expo connecting farmers, startups, and government bodies.',
  },
  {
    event_code: 'EVT-2025-001',
    name: 'Republic Day Parade Support 2025',
    event_type: 'national_celebration',
    gov_level: 'central',
    organising_ministry: 'Ministry of Defence',
    venue: 'Kartavya Path, New Delhi',
    state_code: 'DL',
    district: 'New Delhi',
    start_date: '2025-01-26',
    end_date: '2025-01-27',
    expected_footfall: 100000,
    status: 'closed',
    description: '76th Republic Day logistics and asset management.',
  },
];

async function run() {
  await client.connect();
  console.log('Connected to database\n');

  for (const ev of EVENTS) {
    const result = await client.query(`
      INSERT INTO events (
        event_code, name, event_type, gov_level, organising_ministry,
        venue, state_code, district, start_date, end_date,
        expected_footfall, status, description, created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::event_status,$13,$14)
      ON CONFLICT (event_code) DO UPDATE SET
        name = EXCLUDED.name,
        status = EXCLUDED.status::event_status
      RETURNING id, event_code
    `, [ev.event_code, ev.name, ev.event_type, ev.gov_level, ev.organising_ministry,
        ev.venue, ev.state_code, ev.district, ev.start_date, ev.end_date,
        ev.expected_footfall, ev.status, ev.description, ADMIN_ID]);
    console.log(`  Event: ${ev.name} [${result.rows[0]?.id}]`);
  }

  // Also add some notifications
  await client.query(`
    INSERT INTO notifications (user_id, title, body, is_read)
    VALUES
      ($1, 'Company Pending Approval', 'TechnoCraft Solutions has submitted documents for review', false),
      ($1, 'Event Starting Soon', 'National Technology Summit 2026 starts in 4 days', false),
      ($1, 'Institution Verification', '3 institutions pending verification review', false),
      ($1, 'Asset Scan Detected', 'QR scan recorded at Delhi Warehouse Alpha', true)
  `, [ADMIN_ID]);
  console.log('\n  Notifications inserted');

  const count = await client.query('SELECT count(*) FROM events');
  console.log(`\nTotal events: ${count.rows[0].count}`);

  await client.end();
  console.log('Done!');
}

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
