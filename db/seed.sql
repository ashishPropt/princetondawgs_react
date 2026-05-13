-- Princeton Dawgs — Seed Data (PostgreSQL)
-- Run after schema.sql

INSERT INTO events (id, name, type, starts_on, description, status) VALUES
  (1, 'Dawg Days of Summer 2026', 'tournament', '2026-07-15',
   'Annual Princeton Dawgs club tournament — round-robin team format.', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO events (id, name, type, ntrp_level, starts_on, description, status) VALUES
  (2, 'USTA 3.0 Spring League 2025', 'usta_league', 3.0, '2025-03-01',
   'USTA Adult 18+ 3.0 Spring 2025 — we play other club teams.', 'active'),
  (3, 'USTA 3.5 Spring League 2025', 'usta_league', 3.5, '2025-03-01',
   'USTA Adult 18+ 3.5 Spring 2025 — we play other club teams.', 'active')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence so future inserts don't collide
SELECT setval('events_id_seq', (SELECT MAX(id) FROM events));

-- Sample opposition teams
INSERT INTO opposition_teams (event_id, name, contact_info) VALUES
  (2, 'Nassau Club', 'nassau@tennis.com'),
  (2, 'Lawrenceville TC', 'ltc@tennis.com'),
  (3, 'Hopewell Valley Tennis', 'hvt@tennis.com'),
  (3, 'West Windsor TC', 'wwtc@tennis.com')
ON CONFLICT DO NOTHING;

-- Sample sponsors
INSERT INTO sponsors (name, tier, website_url, is_active) VALUES
  ('Princeton Racquet Club', 'gold', 'https://example.com', true),
  ('NJ Tennis & Education Foundation', 'silver', 'https://example.com', true),
  ('Local Ace Sports', 'bronze', 'https://example.com', true)
ON CONFLICT DO NOTHING;

-- Sample shop items
INSERT INTO shop_items (name, description, price, category, in_stock) VALUES
  ('Dawgs Polo Shirt', 'Official Princeton Dawgs performance polo — navy/orange', 45.00, 'Apparel', true),
  ('Dawgs Cap', 'Embroidered snapback — one size fits all', 28.00, 'Apparel', true),
  ('Dawgs Water Bottle', '32oz stainless — keep those aces hydrated', 22.00, 'Accessories', true),
  ('Dawgs Bag Tag', 'Rubber paw print luggage tag', 8.00, 'Accessories', true)
ON CONFLICT DO NOTHING;
