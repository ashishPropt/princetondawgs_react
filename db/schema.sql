-- Princeton Dawgs — PostgreSQL Schema
-- Run: psql -U postgres -d princetondawgs -f db/schema.sql

-- ── PLAYERS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS players (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  ntrp          NUMERIC(2,1) NULL,
  phone         VARCHAR(30)  NULL,
  is_admin      BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ── EVENTS (tournaments AND usta leagues) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  type        VARCHAR(20)  NOT NULL DEFAULT 'tournament'
                CHECK (type IN ('tournament','usta_league')),
  ntrp_level  NUMERIC(2,1) NULL,
  starts_on   DATE         NULL,
  description TEXT         NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','completed','draft')),
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ── EVENT REGISTRATIONS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_registrations (
  id        SERIAL PRIMARY KEY,
  event_id  INT NOT NULL REFERENCES events(id)   ON DELETE CASCADE,
  player_id INT NOT NULL REFERENCES players(id)  ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (event_id, player_id)
);

-- ── TOURNAMENT: teams ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teams (
  id       SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name     VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS player_teams (
  player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id   INT NOT NULL REFERENCES teams(id)   ON DELETE CASCADE,
  PRIMARY KEY (player_id, team_id)
);

-- ── TOURNAMENT: ties & matches ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ties (
  id           SERIAL PRIMARY KEY,
  event_id     INT  NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  team_a_id    INT  NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
  team_b_id    INT  NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
  is_final     BOOLEAN  DEFAULT FALSE,
  locked       BOOLEAN  DEFAULT FALSE,
  scheduled_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS matches (
  id             SERIAL PRIMARY KEY,
  tie_id         INT  NOT NULL REFERENCES ties(id) ON DELETE CASCADE,
  match_type     VARCHAR(5)  NOT NULL CHECK (match_type IN ('S1','S2','D')),
  points_value   INT  NOT NULL,
  team_a_player1 INT  NULL,
  team_a_player2 INT  NULL,
  team_b_player1 INT  NULL,
  team_b_player2 INT  NULL,
  score          VARCHAR(80) NULL,
  games_a        INT  DEFAULT 0,
  games_b        INT  DEFAULT 0,
  winner_team    CHAR(1) NULL,
  entered_by     INT  NULL,
  entered_at     TIMESTAMPTZ NULL
);

-- ── USTA LEAGUE: opposition teams ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS opposition_teams (
  id           SERIAL PRIMARY KEY,
  event_id     INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name         VARCHAR(150) NOT NULL,
  contact_info VARCHAR(255) NULL
);

-- ── USTA LEAGUE: scheduled match days ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS league_match_days (
  id                 SERIAL PRIMARY KEY,
  event_id           INT  NOT NULL REFERENCES events(id)           ON DELETE CASCADE,
  opposition_team_id INT  NOT NULL REFERENCES opposition_teams(id) ON DELETE CASCADE,
  match_date         DATE NOT NULL,
  match_time         TIME NULL,
  location           VARCHAR(255) NULL,
  notes              TEXT NULL,
  status             VARCHAR(20) DEFAULT 'scheduled'
                       CHECK (status IN ('scheduled','completed','cancelled'))
);

-- ── USTA LEAGUE: individual player scores ────────────────────────────────────
CREATE TABLE IF NOT EXISTS league_scores (
  id                  SERIAL PRIMARY KEY,
  league_match_day_id INT  NOT NULL REFERENCES league_match_days(id) ON DELETE CASCADE,
  player_id           INT  NOT NULL REFERENCES players(id)           ON DELETE CASCADE,
  match_type          VARCHAR(10) NOT NULL DEFAULT 'singles'
                        CHECK (match_type IN ('singles','doubles')),
  partner_name        VARCHAR(150) NULL,
  opponent1_name      VARCHAR(150) NOT NULL,
  opponent2_name      VARCHAR(150) NULL,
  score               VARCHAR(100) NOT NULL,
  result              VARCHAR(10)  NOT NULL CHECK (result IN ('win','loss')),
  notes               TEXT NULL,
  entered_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── INTEREST / JOIN FORM ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interest_submissions (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  phone      VARCHAR(30)  NULL,
  ntrp       VARCHAR(10)  NULL,
  message    TEXT         NULL,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ── PASSWORD RESETS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS password_resets (
  id         SERIAL PRIMARY KEY,
  player_id  INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  token      VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ  NOT NULL,
  used       BOOLEAN      DEFAULT FALSE,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ── SPONSORS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sponsors (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  tier        VARCHAR(20)  NOT NULL DEFAULT 'friend'
                CHECK (tier IN ('platinum','gold','silver','bronze','friend')),
  logo_url    VARCHAR(255) NULL,
  website_url VARCHAR(255) NULL,
  is_active   BOOLEAN      DEFAULT TRUE,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ── SPONSOR INQUIRIES ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sponsor_inquiries (
  id           SERIAL PRIMARY KEY,
  company_name VARCHAR(150) NOT NULL,
  contact_name VARCHAR(150) NOT NULL,
  email        VARCHAR(150) NOT NULL,
  tier_interest VARCHAR(20) NULL,
  message      TEXT         NULL,
  created_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- ── SHOP ITEMS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shop_items (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  description TEXT         NULL,
  price       NUMERIC(8,2) NOT NULL,
  image_url   VARCHAR(255) NULL,
  category    VARCHAR(80)  NULL,
  in_stock    BOOLEAN      DEFAULT TRUE,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);
