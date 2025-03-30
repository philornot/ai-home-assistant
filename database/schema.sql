CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_message TEXT,
  assistant_response TEXT
);

CREATE INDEX IF NOT EXISTS idx_timestamp ON conversations(timestamp);

-- Tabela dla ustawień
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE,
  value TEXT
);

-- Domyślne ustawienia
INSERT OR IGNORE INTO settings (key, value) VALUES ('personality_prompt', 'Jesteś pomocnym asystentem domowym, który mówi po polsku w przyjacielskim tonie.');
INSERT OR IGNORE INTO settings (key, value) VALUES ('model', 'claude-3-haiku-20240307');
INSERT OR IGNORE INTO settings (key, value) VALUES ('temperature', '0.7');
INSERT OR IGNORE INTO settings (key, value) VALUES ('max_tokens', '500');