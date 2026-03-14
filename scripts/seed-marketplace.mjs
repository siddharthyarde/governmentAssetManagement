/**
 * GAMS Marketplace Seed — 30 realistic government asset listings
 * Usage: node scripts/seed-marketplace.mjs
 * Reads DB credentials from root .env
 */

import pg from 'pg';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env from repo root
const envPath = join(__dirname, '../.env');
const envLines = readFileSync(envPath, 'utf8').split('\n');
for (const line of envLines) {
  const m = line.match(/^([A-Z_]+)=(.+)$/);
  if (m) process.env[m[1]] ??= m[2].trim();
}

const { Client } = pg;
const client = new Client({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT ?? '5432'),
  database: process.env.DB_NAME ?? 'postgres',
  user:     process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

// Supabase admin user ID (superadmin@gams.gov.in)
const ADMIN_ID = 'a4274b54-f3b5-41fa-8c87-a188f52b003c';

// ─── Companies ────────────────────────────────────────────────────────────────
const COMPANIES = [
  {
    company_code: 'DLH001',
    legal_name: 'Godrej Interio Limited',
    trade_name: 'Godrej Interio',
    gstin: '27AABCG1234F1ZX',
    pan: 'AABCG1234F',
    contact_email: 'procurement@godrejinterio.com',
    contact_mobile: '9821000001',
    website: 'https://www.godrejinterio.com',
    address: '{"line1":"Pirojshanagar, Eastern Express Highway","city":"Mumbai","district":"Mumbai","state":"MH","pincode":"400079"}',
  },
  {
    company_code: 'KAR001',
    legal_name: 'Samsung India Electronics Pvt Ltd',
    trade_name: 'Samsung India',
    gstin: '29AABCS1234D1ZY',
    pan: 'AABCS1234D',
    contact_email: 'b2b@samsung.com',
    contact_mobile: '9845000002',
    website: 'https://www.samsung.com/in',
    address: '{"line1":"2nd & 3rd Floor, Tower C, Vipul Tech Square","city":"Gurgaon","district":"Gurugram","state":"HR","pincode":"122002"}',
  },
  {
    company_code: 'MHT001',
    legal_name: 'Dell International Services India Pvt Ltd',
    trade_name: 'Dell Technologies',
    gstin: '27AABCD5678B1ZP',
    pan: 'AABCD5678B',
    contact_email: 'govtindia@dell.com',
    contact_mobile: '9022000003',
    website: 'https://www.dell.com/en-in',
    address: '{"line1":"Infinity Tower, Old Airport Road","city":"Bengaluru","district":"Bengaluru Urban","state":"KA","pincode":"560008"}',
  },
  {
    company_code: 'TNA001',
    legal_name: 'PrintMax India Pvt Ltd',
    trade_name: 'PrintMax',
    gstin: '33AABCP9876A1ZM',
    pan: 'AABCP9876A',
    contact_email: 'orders@printmaxindia.com',
    contact_mobile: '9444000004',
    website: 'https://www.printmaxindia.com',
    address: '{"line1":"Plot 14, SIDCO Industrial Estate","city":"Chennai","district":"Chennai","state":"TN","pincode":"600098"}',
  },
  {
    company_code: 'GJT001',
    legal_name: 'Borosil Limited',
    trade_name: 'Borosil',
    gstin: '24AABCB2345C1ZQ',
    pan: 'AABCB2345C',
    contact_email: 'institutional@borosil.com',
    contact_mobile: '9427000005',
    website: 'https://www.borosil.com',
    address: '{"line1":"1101 Dalamal House, Nariman Point","city":"Mumbai","district":"Mumbai","state":"MH","pincode":"400021"}',
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────
// images → Unsplash stable photo URLs (1600px wide, crop to square)
const PRODUCTS = [
  // ── FURNITURE ──────────────────────────────────────────────────────────────
  {
    code: 'GOI-DLH001-R-FURN-2024-00000001',
    co: 'DLH001', name: 'Steel Folding Chair — Black Fabric Seat',
    name_hi: 'स्टील फोल्डिंग चेयर — काली फैब्रिक सीट',
    desc: 'Heavy-duty banquet folding chair with powder-coated steel frame and PVC foam-padded seat. Stackable up to 10 units. Weight capacity: 150 kg. Suitable for large outdoor events, conferences, and government functions.',
    category: 'Furniture', sub: 'Seating', hsn: '94016900', unit: 'piece',
    price: 320000, brand: 'Godrej', model: 'FLD-BLK-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&fit=crop&auto=format', alt: 'Steel folding chair', is_primary: true },
    ],
  },
  {
    code: 'GOI-DLH001-R-FURN-2024-00000002',
    co: 'DLH001', name: 'Conference Table — 8-Seater Steel Frame',
    name_hi: '8-सीटर कॉन्फ्रेंस टेबल — स्टील फ्रेम',
    desc: 'Heavy-duty 8-seater conference table with laminated particle-board top and powder-coated steel legs. Dimension: 240 cm × 90 cm × 75 cm. Cable management tray included. Ideal for government meeting rooms.',
    category: 'Furniture', sub: 'Tables', hsn: '94036000', unit: 'piece',
    price: 2200000, brand: 'Godrej', model: 'CONF-8-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&fit=crop&auto=format', alt: 'Conference table', is_primary: true },
    ],
  },
  {
    code: 'GOI-DLH001-R-FURN-2024-00000003',
    co: 'DLH001', name: 'Executive Ergonomic Office Chair',
    name_hi: 'एग्जिक्यूटिव एर्गोनॉमिक ऑफिस चेयर',
    desc: 'High-back executive chair with lumbar support, adjustable armrests, and mesh back for breathability. Pneumatic seat height adjustment. 5-star chrome base with casters. Weight capacity: 120 kg.',
    category: 'Furniture', sub: 'Seating', hsn: '94013000', unit: 'piece',
    price: 1250000, brand: 'Godrej', model: 'ERGO-EX-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&fit=crop&auto=format', alt: 'Executive office chair', is_primary: true },
    ],
  },
  {
    code: 'GOI-DLH001-R-FURN-2024-00000004',
    co: 'DLH001', name: 'Steel Almirah — Double Door, 4 Shelf',
    name_hi: 'स्टील अलमारी — डबल डोर, 4 शेल्फ',
    desc: 'Heavy-gauge CRC steel almirah with baked enamel finish. 4 adjustable shelves, built-in locking mechanism, and anti-rust treatment. Dimension: 183 cm × 91 cm × 46 cm. Ideal for government record storage.',
    category: 'Furniture', sub: 'Storage', hsn: '94033000', unit: 'piece',
    price: 850000, brand: 'Godrej', model: 'ALM-DD4-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d3f?w=800&fit=crop&auto=format', alt: 'Steel almirah', is_primary: true },
    ],
  },
  {
    code: 'GOI-DLH001-R-FURN-2024-00000005',
    co: 'DLH001', name: 'Plastic Monobloc Chair — White',
    name_hi: 'प्लास्टिक मोनोब्लॉक चेयर — सफेद',
    desc: 'UV-stabilised polypropylene monobloc chair suitable for indoor and outdoor use. Stackable up to 15 units. Weight capacity: 100 kg. Compliant with Bureau of Indian Standards (BIS) IS:1192.',
    category: 'Furniture', sub: 'Seating', hsn: '94016900', unit: 'piece',
    price: 95000, brand: 'Nilkamal', model: 'MONO-WHT-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&fit=crop&auto=format', alt: 'White plastic monobloc chair', is_primary: true },
    ],
  },
  {
    code: 'GOI-DLH001-R-FURN-2024-00000006',
    co: 'DLH001', name: 'Wooden Bookshelf — 6-Tier, Teak Finish',
    name_hi: 'लकड़ी की बुकशेल्फ — 6-टियर, टीक फिनिश',
    desc: 'Six-tier bookshelf in engineered wood with teak veneer finish. Adjustable shelves, toe kick included. Dimension: 180 cm × 80 cm × 30 cm. Suitable for government libraries and offices.',
    category: 'Furniture', sub: 'Storage', hsn: '94033000', unit: 'piece',
    price: 720000, brand: 'Godrej', model: 'BSHF-TK6-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&fit=crop&auto=format', alt: 'Wooden bookshelf', is_primary: true },
    ],
  },
  {
    code: 'GOI-DLH001-R-FURN-2024-00000007',
    co: 'DLH001', name: 'Reception Sofa Set — 3+1+1 Seater',
    name_hi: 'रिसेप्शन सोफा सेट — 3+1+1 सीटर',
    desc: 'Reception-grade leatherette sofa set (3-seater + two 1-seaters) with solid wood frame and high-density foam cushions. Color: Dark grey. Centre table included. Suitable for waiting areas and VIP lounges.',
    category: 'Furniture', sub: 'Seating', hsn: '94013000', unit: 'set',
    price: 3800000, brand: 'Godrej', model: 'SOFA-311-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&fit=crop&auto=format', alt: 'Reception sofa set', is_primary: true },
    ],
  },
  {
    code: 'GOI-DLH001-R-FURN-2024-00000008',
    co: 'DLH001', name: 'Study/Office Table with Storage',
    name_hi: 'स्टडी/ऑफिस टेबल विद स्टोरेज',
    desc: 'L-shaped office workstation with 3-drawer pedestal and overhead storage cabinet. Engineered wood top with edge banding. Dimension: 150 cm × 120 cm × 75 cm. Includes cable management grommet.',
    category: 'Furniture', sub: 'Tables', hsn: '94036000', unit: 'piece',
    price: 1450000, brand: 'Godrej', model: 'STDY-L-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&fit=crop&auto=format', alt: 'Office study table', is_primary: true },
    ],
  },
  // ── ELECTRONICS ────────────────────────────────────────────────────────────
  {
    code: 'GOI-MHT001-R-ELEC-2024-00000001',
    co: 'MHT001', name: 'Dell OptiPlex 7010 Desktop Computer',
    name_hi: 'डेल ऑप्टिप्लेक्स 7010 डेस्कटॉप कंप्यूटर',
    desc: 'Intel Core i5-12500T, 8 GB DDR4 RAM, 256 GB SSD, Intel UHD 770 Graphics. Windows 11 Pro. Includes keyboard, mouse and 21.5" FHD monitor. ISED certified.',
    category: 'Electronics', sub: 'Computers', hsn: '84714100', unit: 'set',
    price: 5500000, brand: 'Dell', model: 'OptiPlex 7010',
    images: [
      { url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&fit=crop&auto=format', alt: 'Desktop computer', is_primary: true },
    ],
  },
  {
    code: 'GOI-MHT001-R-ELEC-2024-00000002',
    co: 'MHT001', name: 'HP LaserJet Enterprise M406dn Printer',
    name_hi: 'एचपी लेजरजेट एंटरप्राइज़ M406dn प्रिंटर',
    desc: 'Mono A4 laser printer. Print speed: 38 ppm. Duplex printing, 1200 × 1200 dpi. Ethernet + USB. 250-sheet input tray + 50-sheet multipurpose tray. Duty cycle: 80,000 pages/month.',
    category: 'Electronics', sub: 'Printers', hsn: '84433100', unit: 'piece',
    price: 2800000, brand: 'HP', model: 'LaserJet M406dn',
    images: [
      { url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&fit=crop&auto=format', alt: 'HP laser printer', is_primary: true },
    ],
  },
  {
    code: 'GOI-MHT001-R-ELEC-2024-00000003',
    co: 'MHT001', name: 'BenQ MH560 LED Projector — 3800 Lumens',
    name_hi: 'बेनक्यू MH560 LED प्रोजेक्टर — 3800 लुमेन',
    desc: 'Full HD (1920×1080) DLP projector. 3800 ANSI lumens brightness, 20000:1 contrast ratio. HDMI, VGA, USB-A inputs. 10W speaker. Lamp life: 15,000 hrs (EcoBlank mode). Suitable for large conference halls.',
    category: 'Electronics', sub: 'AV Equipment', hsn: '85286200', unit: 'piece',
    price: 6500000, brand: 'BenQ', model: 'MH560',
    images: [
      { url: 'https://images.unsplash.com/photo-1573167710701-35950a41e251?w=800&fit=crop&auto=format', alt: 'LED projector', is_primary: true },
    ],
  },
  {
    code: 'GOI-MHT001-R-ELEC-2024-00000004',
    co: 'MHT001', name: 'APC Back-UPS 600VA UPS System',
    name_hi: 'APC बैक-UPS 600VA यूपीएस सिस्टम',
    desc: '600VA / 360W online UPS with AVR and surge protection. 4 outlets (2 battery + 2 surge). Runtime: 5 min at full load. Includes RJ11/RJ45 dataline protection. USB connectivity for auto-shutdown.',
    category: 'Electronics', sub: 'Power', hsn: '85044010', unit: 'piece',
    price: 480000, brand: 'APC', model: 'BX600C-IN',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&fit=crop&auto=format', alt: 'UPS system', is_primary: true },
    ],
  },
  {
    code: 'GOI-MHT001-R-ELEC-2024-00000005',
    co: 'MHT001', name: 'Hikvision 8-Channel CCTV NVR Kit',
    name_hi: 'हिकविजन 8-चैनल CCTV NVR किट',
    desc: '8-channel NVR kit with 8 × 4MP dome IP cameras, 2TB HDD, 30m IR night vision, weatherproof (IP67), PoE switch included. Supports remote monitoring via smartphone. H.265+ compression.',
    category: 'Electronics', sub: 'Security', hsn: '85258090', unit: 'set',
    price: 3800000, brand: 'Hikvision', model: 'DS-NVR-8P',
    images: [
      { url: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&fit=crop&auto=format', alt: 'CCTV camera system', is_primary: true },
    ],
  },
  {
    code: 'GOI-MHT001-R-ELEC-2024-00000006',
    co: 'MHT001', name: 'Motorola Walkie-Talkie Set — 16-Channel, 5W',
    name_hi: 'मोटोरोला वॉकी-टॉकी सेट — 16-चैनल, 5W',
    desc: 'Set of 10 Motorola XT460 two-way radios. 5W output power, 16 channels, 5 km range (open area). IP54 dust and weather resistant. VOX hands-free. Li-ion battery with 12-hour battery life. Base charging station included.',
    category: 'Electronics', sub: 'Communication', hsn: '85258020', unit: 'set',
    price: 9500000, brand: 'Motorola', model: 'XT460-10',
    images: [
      { url: 'https://images.unsplash.com/photo-1519508234439-4f23643125c1?w=800&fit=crop&auto=format', alt: 'Walkie talkie radio set', is_primary: true },
    ],
  },
  // ── APPLIANCES ─────────────────────────────────────────────────────────────
  {
    code: 'GOI-KAR001-R-APPL-2024-00000001',
    co: 'KAR001', name: 'Samsung 1.5 Ton Inverter Split AC',
    name_hi: 'सैमसंग 1.5 टन इन्वर्टर स्प्लिट AC',
    desc: '5-star BEE rated split air conditioner. R-32 refrigerant. Auto Clean, Fast Cooling, Wi-Fi enabled (SmartThings). Capacity: 1.5 TR. Indoor unit: 860 × 299 × 215 mm. Annual power consumption: 741 kWh.',
    category: 'Appliances', sub: 'Air Conditioning', hsn: '84151010', unit: 'piece',
    price: 3800000, brand: 'Samsung', model: 'AR18BYNZABE',
    images: [
      { url: 'https://images.unsplash.com/photo-1621624441553-d73d8c0bc41a?w=800&fit=crop&auto=format', alt: 'Split air conditioner', is_primary: true },
    ],
  },
  {
    code: 'GOI-KAR001-R-APPL-2024-00000002',
    co: 'KAR001', name: 'Crompton Ozone Desert Air Cooler — 55L',
    name_hi: 'क्रॉम्प्टन ओज़ोन डेजर्ट एयर कूलर — 55L',
    desc: '55-litre desert air cooler with 4-way air deflection and honeycomb cooling pads. Air flow: 4500 m³/hr. Inverter motor for energy efficiency. Auto-fill and auto-refill functions. Remote control included.',
    category: 'Appliances', sub: 'Cooling', hsn: '84794000', unit: 'piece',
    price: 1200000, brand: 'Crompton', model: 'ACGC-DAC555',
    images: [
      { url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&fit=crop&auto=format', alt: 'Desert air cooler', is_primary: true },
    ],
  },
  {
    code: 'GOI-GJT001-R-APPL-2024-00000001',
    co: 'GJT001', name: 'Aquaguard Aura RO+UV+UF Water Purifier',
    name_hi: 'एक्वागार्ड ऑरा RO+UV+UF वाटर प्यूरीफायर',
    desc: 'Wall-mounted 7-stage water purifier. RO+UV+UF+Mineral Guard technology. Purification capacity: 12 L/hr. Tank capacity: 6 litres. Works on input TDS up to 2000 ppm. Auto shut-off when tank full.',
    category: 'Appliances', sub: 'Water', hsn: '84211990', unit: 'piece',
    price: 1850000, brand: 'Aquaguard', model: 'GCWSTBUVARA30',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&fit=crop&auto=format', alt: 'Water purifier RO UV', is_primary: true },
    ],
  },
  {
    code: 'GOI-KAR001-R-APPL-2024-00000003',
    co: 'KAR001', name: 'Samsung 345L Frost-Free Refrigerator',
    name_hi: 'सैमसंग 345L फ्रॉस्ट-फ्री रेफ्रिजरेटर',
    desc: '345-litre, 3-star double door frost-free refrigerator. SpaceMax technology, Digital Inverter Compressor, All-around Cooling. Power consumption: 230 kWh/year. Color: Refined Inox.',
    category: 'Appliances', sub: 'Refrigeration', hsn: '84181010', unit: 'piece',
    price: 4200000, brand: 'Samsung', model: 'RT37T4533S8',
    images: [
      { url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&fit=crop&auto=format', alt: 'Double door refrigerator', is_primary: true },
    ],
  },
  {
    code: 'GOI-GJT001-R-APPL-2024-00000002',
    co: 'GJT001', name: 'Borosil Stainless Steel Catering Set — 50 Piece',
    name_hi: 'बोरोसिल स्टेनलेस स्टील कैटरिंग सेट — 50 पीस',
    desc: '50-piece commercial catering set in food-grade 18/8 stainless steel. Includes: 10 serving bowls (2L each), 10 serving spoons, 10 dinner plates (30cm), 10 tumblers, 10 serving trays. BIS certified.',
    category: 'Appliances', sub: 'Catering', hsn: '73239390', unit: 'set',
    price: 1500000, brand: 'Borosil', model: 'BSSL-CAT-50',
    images: [
      { url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&fit=crop&auto=format', alt: 'Stainless steel catering set', is_primary: true },
    ],
  },
  {
    code: 'GOI-GJT001-R-APPL-2024-00000003',
    co: 'GJT001', name: 'Commercial Microwave Oven — 30L',
    name_hi: 'कमर्शियल माइक्रोवेव ओवन — 30L',
    desc: '30-litre convection microwave oven with grill function. 900W microwave power, 1350W convection. 6 auto-cook menus. Touch control panel with child lock. Stainless steel cavity. BEE 4-star rated.',
    category: 'Appliances', sub: 'Kitchen', hsn: '85166000', unit: 'piece',
    price: 2200000, brand: 'Borosil', model: 'BMO-30CM-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&fit=crop&auto=format', alt: 'Microwave oven', is_primary: true },
    ],
  },
  // ── TEXTILES ───────────────────────────────────────────────────────────────
  {
    code: 'GOI-TNA001-R-TEXT-2024-00000001',
    co: 'TNA001', name: 'Stage Backdrop Banner — Poly Cotton 10×20 ft',
    name_hi: 'स्टेज बैकड्रॉप बैनर — पॉली कॉटन 10×20 फुट',
    desc: 'Poly-cotton stage backdrop banner printed with GAMS Government branding. 10 × 20 feet. UV-fade resistant ink, reinforced grommet edges at 0.5 m intervals. Can be re-used for multiple events. Supplied rolled in protective sleeve.',
    category: 'Textiles', sub: 'Banners', hsn: '59039090', unit: 'piece',
    price: 850000, brand: 'PrintMax', model: 'BNRPC-2010-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?w=800&fit=crop&auto=format', alt: 'Stage backdrop banner', is_primary: true },
    ],
  },
  {
    code: 'GOI-TNA001-R-TEXT-2024-00000002',
    co: 'TNA001', name: 'Cotton Mattress — Single (78×30×4 inch)',
    name_hi: 'कॉटन मैट्रेस — सिंगल (78×30×4 इंच)',
    desc: 'BIS-certified single-size cotton mattress with quilted fabric cover. Dimensions: 198 cm × 76 cm × 10 cm. Density: 28 kg/m³. Firm support for institutional use. Supplied with mattress protector.',
    category: 'Textiles', sub: 'Bedding', hsn: '94041000', unit: 'piece',
    price: 650000, brand: 'SleepWell', model: 'SW-CTS-78-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1532301791573-4a6b61aac6b5?w=800&fit=crop&auto=format', alt: 'Cotton mattress', is_primary: true },
    ],
  },
  {
    code: 'GOI-TNA001-R-TEXT-2024-00000003',
    co: 'TNA001', name: 'Velvet Table Cover Set — 10 Pieces',
    name_hi: 'वेलवेट टेबल कवर सेट — 10 पीस',
    desc: 'Set of 10 velvet table covers in tricolor (saffron, white, green). Machine-washable polyester velvet with satin border trim. Fits conference tables up to 6 feet. Suitable for all government events and ceremonies.',
    category: 'Textiles', sub: 'Table Linen', hsn: '63039900', unit: 'set',
    price: 480000, brand: 'PrintMax', model: 'VTC-TRI-10',
    images: [
      { url: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&fit=crop&auto=format', alt: 'Velvet table covers', is_primary: true },
    ],
  },
  {
    code: 'GOI-TNA001-R-TEXT-2024-00000004',
    co: 'TNA001', name: 'Woolen Blanket — Army Grade (60×90 inch)',
    name_hi: 'ऊनी कंबल — आर्मी ग्रेड (60×90 इंच)',
    desc: '60% wool, 40% acrylic government-grade blanket. Weight: 2.5 kg. Dimensions: 152 × 228 cm. Machine washable. BIS IS:3769 certified. Suitable for institutional use, disaster relief, and official guest accommodation.',
    category: 'Textiles', sub: 'Blankets', hsn: '63014000', unit: 'piece',
    price: 920000, brand: 'OCM', model: 'OCM-WOOL-60-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800&fit=crop&auto=format', alt: 'Woolen blanket', is_primary: true },
    ],
  },
  // ── MEDICAL ────────────────────────────────────────────────────────────────
  {
    code: 'GOI-GJT001-R-MEDC-2024-00000001',
    co: 'GJT001', name: 'First Aid Kit — Comprehensive (150 items)',
    name_hi: 'फर्स्ट एड किट — व्यापक (150 आइटम)',
    desc: '150-piece comprehensive first aid kit in hard-shell carry case. Includes bandages, antiseptics, gloves, scissors, tweezers, CPR mask, splints, and emergency blanket. Complies with BIS IS:7152. Suitable for events with 500+ attendees.',
    category: 'Medical', sub: 'First Aid', hsn: '90189099', unit: 'set',
    price: 380000, brand: 'Dr. Morepen', model: 'FAK-150-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&fit=crop&auto=format', alt: 'First aid kit medical', is_primary: true },
    ],
  },
  {
    code: 'GOI-GJT001-R-MEDC-2024-00000002',
    co: 'GJT001', name: 'Omron HEM-7156T Blood Pressure Monitor',
    name_hi: 'ओमरोन HEM-7156T ब्लड प्रेशर मॉनिटर',
    desc: 'Automatic upper arm blood pressure monitor with IntelliSense technology. Bluetooth enabled, 60-reading memory per user. Detects irregular heartbeat (IHB), body movement (MCI). AC adapter + 4 AA batteries. Cuff size 22–32 cm.',
    category: 'Medical', sub: 'Diagnostic', hsn: '90181900', unit: 'piece',
    price: 290000, brand: 'Omron', model: 'HEM-7156T',
    images: [
      { url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&fit=crop&auto=format', alt: 'Blood pressure monitor', is_primary: true },
    ],
  },
  // ── SPORTS ─────────────────────────────────────────────────────────────────
  {
    code: 'GOI-DLH001-R-SPRT-2024-00000001',
    co: 'DLH001', name: 'Stiga Expert Roller Table Tennis Table',
    name_hi: 'स्टिगा एक्सपर्ट रोलर टेबल टेनिस टेबल',
    desc: 'ITTF-approved foldable table tennis table. 25 mm thick top, dual folding with steel base. Built-in rollers for easy movement. Includes net and post set. Playing surface: 274 × 152.5 × 76 cm. For indoor institutional use.',
    category: 'Sports', sub: 'Indoor Sports', hsn: '95066200', unit: 'piece',
    price: 2800000, brand: 'Stiga', model: 'EXPERT-ROLL-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&fit=crop&auto=format', alt: 'Table tennis table', is_primary: true },
    ],
  },
  {
    code: 'GOI-DLH001-R-SPRT-2024-00000002',
    co: 'DLH001', name: 'Yonex Badminton Court Equipment Set',
    name_hi: 'योनेक्स बैडमिंटन कोर्ट इक्विपमेंट सेट',
    desc: 'Complete badminton court set: 10 × Yonex Mavis 350 shuttlecocks, 2 × Yonex Astrox 88 rackets, 1 × portable adjustable net post set with carrying bag, nylon net. Suitable for indoor sports complexes and government recreation clubs.',
    category: 'Sports', sub: 'Outdoor Sports', hsn: '95069900', unit: 'set',
    price: 1850000, brand: 'Yonex', model: 'BDMCRT-YNX-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&fit=crop&auto=format', alt: 'Badminton equipment', is_primary: true },
    ],
  },
  // ── MACHINERY ──────────────────────────────────────────────────────────────
  {
    code: 'GOI-KAR001-R-MACH-2024-00000001',
    co: 'KAR001', name: 'Kirloskar Green KG1-5500A Diesel Generator — 5 kVA',
    name_hi: 'किर्लोस्कर ग्रीन KG1-5500A डीजल जनरेटर — 5 kVA',
    desc: '5 kVA / 4 kW open-frame diesel generator set. Kirloskar 4-stroke, air-cooled diesel engine. Fuel consumption: 1.1 L/hr at 75% load. Output: 220V / 50Hz. BIS IS:10001 certified. Electric and recoil start.',
    category: 'Machinery', sub: 'Power Generation', hsn: '85021100', unit: 'piece',
    price: 9800000, brand: 'Kirloskar', model: 'KG1-5500A',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&fit=crop&auto=format', alt: 'Diesel generator', is_primary: true },
    ],
  },
  {
    code: 'GOI-KAR001-R-MACH-2024-00000002',
    co: 'KAR001', name: 'Orient Electric 36-inch Industrial Pedestal Fan',
    name_hi: 'ओरिएंट इलेक्ट्रिक 36-इंच इंडस्ट्रियल पेडस्टल फैन',
    desc: '36-inch heavy-duty pedestal fan with BLDC motor. Air flow: 18,000 m³/hr. Height adjustable (1.2 m–1.7 m). 3-speed control with timer. Powder-coated steel body and base. Power consumption: 220W. IP21 rated.',
    category: 'Machinery', sub: 'Ventilation', hsn: '84145900', unit: 'piece',
    price: 720000, brand: 'Orient Electric', model: 'PF36-IND-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&fit=crop&auto=format', alt: 'Industrial pedestal fan', is_primary: true },
    ],
  },
  // ── AV EQUIPMENT ───────────────────────────────────────────────────────────
  {
    code: 'GOI-MHT001-R-ELEC-2024-00000007',
    co: 'MHT001', name: 'Shure SM-58 Professional Microphone Set',
    name_hi: 'शुर SM-58 प्रोफेशनल माइक्रोफोन सेट',
    desc: 'Set of 4 Shure SM-58 dynamic cardioid vocal microphones with 4 × 6m XLR cables, padded carrying case and mic clips. Frequency response: 50 Hz–15 kHz. SPL: 94 dB. Widely used for government events, conferences, and speeches.',
    category: 'Electronics', sub: 'AV Equipment', hsn: '85182200', unit: 'set',
    price: 2800000, brand: 'Shure', model: 'SM-58-SET4',
    images: [
      { url: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&fit=crop&auto=format', alt: 'Professional microphone', is_primary: true },
    ],
  },
  {
    code: 'GOI-KAR001-R-ELEC-2024-00000001',
    co: 'KAR001', name: 'Samsung 55-inch 4K QLED Smart TV',
    name_hi: 'सैमसंग 55-इंच 4K QLED स्मार्ट TV',
    desc: '55-inch 4K UHD QLED display. 3840×2160 resolution. 100% colour volume, HDR10+, PurColor. Tizen OS with pre-installed apps. HDMI × 3, USB × 2, Wi-Fi + Bluetooth. Suitable for VIP lounges, briefing rooms, and control rooms.',
    category: 'Electronics', sub: 'Display', hsn: '85287300', unit: 'piece',
    price: 8500000, brand: 'Samsung', model: 'QA55Q60DAKXXL',
    images: [
      { url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4e67e?w=800&fit=crop&auto=format', alt: 'Samsung 4K smart TV', is_primary: true },
    ],
  },
  {
    code: 'GOI-KAR001-R-ELEC-2024-00000002',
    co: 'KAR001', name: 'Samsung Galaxy Tab S8 — Government Edition',
    name_hi: 'सैमसंग गैलेक्सी टैब S8 — गवर्नमेंट एडिशन',
    desc: '11-inch 2K (2560×1600) display, Snapdragon 8 Gen 1, 8 GB RAM, 128 GB storage. Wi-Fi 6E + LTE. Includes S Pen and ruggedised protective case. Pre-loaded with government apps. MIL-STD-810G certified.',
    category: 'Electronics', sub: 'Tablets', hsn: '84713000', unit: 'piece',
    price: 7200000, brand: 'Samsung', model: 'SM-X700NZAAINS',
    images: [
      { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&fit=crop&auto=format', alt: 'Samsung Galaxy tablet', is_primary: true },
    ],
  },
  {
    code: 'GOI-MHT001-R-ELEC-2024-00000008',
    co: 'MHT001', name: 'Dell Latitude 5430 Laptop',
    name_hi: 'डेल लैटिट्यूड 5430 लैपटॉप',
    desc: 'Intel Core i5-1235U, 8 GB DDR4, 512 GB SSD, 14" FHD IPS anti-glare display. Windows 11 Pro. USB-C, USB-A × 2, HDMI, RJ45, SD card slot. 42 Whr battery (8 hrs). MIL-STD-810H ruggedised for field use.',
    category: 'Electronics', sub: 'Computers', hsn: '84713000', unit: 'piece',
    price: 8800000, brand: 'Dell', model: 'Latitude 5430',
    images: [
      { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&fit=crop&auto=format', alt: 'Dell laptop computer', is_primary: true },
    ],
  },
  {
    code: 'GOI-MHT001-R-ELEC-2024-00000009',
    co: 'MHT001', name: 'Canon imageCLASS MF244dw Multifunction Printer',
    name_hi: 'कैनन imageCLASS MF244dw मल्टीफंक्शन प्रिंटर',
    desc: 'Mono laser multifunction (print, scan, copy, fax). Print speed: 28 ppm, 600 × 600 dpi. Wi-Fi Direct, ADF for 35 sheets. Duplex printing. Monthly duty cycle: 15,000 pages. Toner life: 2,400 pages.',
    category: 'Electronics', sub: 'Printers', hsn: '84433200', unit: 'piece',
    price: 1850000, brand: 'Canon', model: 'MF244dw',
    images: [
      { url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&fit=crop&auto=format', alt: 'Multifunction printer', is_primary: true },
    ],
  },
];

// Condition ratings and discount percentages by rating
const RATING_DISCOUNT = { 10: 50, 9: 42, 8: 35, 7: 28, 6: 20 };

// Listings configuration: rating and qty per product
const LISTING_CFG = [
  { rating: 9, qty: 12 }, { rating: 8, qty: 24 }, { rating: 7, qty: 8 },
  { rating: 8, qty: 67 }, { rating: 9, qty: 5 },  { rating: 7, qty: 3 },
  { rating: 8, qty: 2 },  { rating: 9, qty: 6 },  { rating: 7, qty: 34 },
  { rating: 8, qty: 4 },  { rating: 9, qty: 2 },  { rating: 6, qty: 7 },
  { rating: 8, qty: 3 },  { rating: 7, qty: 4 },  { rating: 9, qty: 6 },
  { rating: 8, qty: 24 }, { rating: 7, qty: 8 },  { rating: 9, qty: 3 },
  { rating: 8, qty: 5 },  { rating: 9, qty: 3 },  { rating: 8, qty: 6 },
  { rating: 10, qty: 12 },{ rating: 9, qty: 8 },  { rating: 10, qty: 3 },
  { rating: 10, qty: 15 },{ rating: 9, qty: 7 },  { rating: 8, qty: 14 },
  { rating: 9, qty: 4 },  { rating: 8, qty: 34 }, { rating: 7, qty: 4 },
];

async function run() {
  await client.connect();
  console.log('✓ Connected to database\n');

  // 1. Insert companies
  const companyIds = {};
  for (const co of COMPANIES) {
    const res = await client.query(`
      INSERT INTO companies (
        company_code, legal_name, trade_name, gstin, pan,
        contact_email, contact_mobile, website, registered_address, status,
        reviewed_by, reviewed_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,'approved',$10,NOW())
      ON CONFLICT (company_code) DO UPDATE SET
        legal_name = EXCLUDED.legal_name,
        status = 'approved',
        reviewed_by = $10,
        reviewed_at = NOW()
      RETURNING id
    `, [co.company_code, co.legal_name, co.trade_name, co.gstin, co.pan,
        co.contact_email, co.contact_mobile, co.website, co.address, ADMIN_ID]);
    companyIds[co.company_code] = res.rows[0].id;
    console.log(`  Company: ${co.trade_name} → ${res.rows[0].id}`);
  }

  // 2. User profile for admin (ensure exists)
  await client.query(`
    INSERT INTO user_profiles (id, full_name, email, role, is_active)
    VALUES ($1, 'GAMS Super Admin', 'superadmin@gams.gov.in', 'super_admin', true)
    ON CONFLICT (id) DO NOTHING
  `, [ADMIN_ID]);

  // 3. Insert products, product_instances, redistribution_listings
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const cfg = LISTING_CFG[i] || { rating: 8, qty: 10 };
    const coId = companyIds[p.co];
    const discountPct = RATING_DISCOUNT[cfg.rating] || 28;
    const listedPrice = Math.round(p.price * (1 - discountPct / 100));

    // Insert product
    const prodRes = await client.query(`
      INSERT INTO products (
        product_code, company_id, name, name_hi, description,
        product_type, category, sub_category, hsn_code, unit,
        original_price_paise, brand, model_number, images,
        status, approved_by, approved_at, mfg_year
      ) VALUES ($1,$2,$3,$4,$5,'reusable',$6,$7,$8,$9,$10,$11,$12,$13::jsonb,'approved',$14,NOW(),2024)
      ON CONFLICT (product_code) DO UPDATE SET
        name = EXCLUDED.name,
        images = EXCLUDED.images,
        status = 'approved'
      RETURNING id
    `, [p.code, coId, p.name, p.name_hi, p.desc,
        p.category, p.sub, p.hsn, p.unit, p.price,
        p.brand, p.model, JSON.stringify(p.images), ADMIN_ID]);
    const productId = prodRes.rows[0].id;

    // Insert product_instance
    const instCode = p.code.replace('-R-', '-I-') + '-' + String(i + 1).padStart(4, '0');
    const instRes = await client.query(`
      INSERT INTO product_instances (
        instance_code, product_id, company_id,
        condition_rating, status, mfg_date
      ) VALUES ($1,$2,$3,$4,'in_stock','2024-01-15')
      ON CONFLICT (instance_code) DO UPDATE SET
        condition_rating = EXCLUDED.condition_rating
      RETURNING id
    `, [instCode, productId, coId, cfg.rating]);
    const instanceId = instRes.rows[0].id;

    // Insert redistribution_listing
    const listCode = 'LST-2026-' + String(i + 1).padStart(5, '0');
    await client.query(`
      INSERT INTO redistribution_listings (
        listing_code, instance_id, redistribution_type,
        condition_rating, listed_price_paise, original_price_paise,
        discount_pct, quantity_available, status,
        listed_by, listed_at
      ) VALUES ($1,$2,'public_sale',$3,$4,$5,$6,$7,'listed',$8,NOW())
      ON CONFLICT (listing_code) DO UPDATE SET
        status = 'listed',
        quantity_available = EXCLUDED.quantity_available
    `, [listCode, instanceId, cfg.rating, listedPrice, p.price,
        discountPct, cfg.qty, ADMIN_ID]);

    console.log(`  [${i + 1}/30] ${p.name} | ₹${(listedPrice / 100).toFixed(0)} | qty:${cfg.qty} | rating:${cfg.rating}`);
  }

  // 4. Verify
  const finalCount = await client.query('SELECT count(*) FROM redistribution_listings WHERE status = $1', ['listed']);
  console.log(`\n✓ Done! Total listed items: ${finalCount.rows[0].count}`);
  await client.end();
}

run().catch(e => { console.error('Seed failed:', e.message); process.exit(1); });
