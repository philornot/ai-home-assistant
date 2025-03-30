const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../database/memory.db');
const db = new sqlite3.Database(DB_PATH);

// Funkcja do zapisywania rozmowy
function saveConversation(userMessage, assistantResponse) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO conversations (user_message, assistant_response) VALUES (?, ?)';
    db.run(query, [userMessage, assistantResponse], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

// Funkcja do pobierania ostatnich rozmów
function getLastConversations(limit = 5) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT user_message, assistant_response FROM conversations ORDER BY timestamp DESC LIMIT ?';
    db.all(query, [limit], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Funkcja do pobierania ustawienia
function getSetting(key) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT value FROM settings WHERE key = ?';
    db.get(query, [key], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.value : null);
      }
    });
  });
}

// Funkcja do zapisywania ustawienia
function saveSetting(key, value) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)';
    db.run(query, [key, value], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

// Funkcja do pobierania konwersacji z paginacją
function getConversationsWithPagination(limit = 20, offset = 0) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, timestamp, user_message, assistant_response 
      FROM conversations 
      ORDER BY timestamp DESC 
      LIMIT ? OFFSET ?
    `;
    db.all(query, [limit, offset], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Funkcja do liczenia konwersacji
function getConversationsCount() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) as count FROM conversations';
    db.get(query, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
}

// Funkcja do liczenia dzisiejszych konwersacji
function getTodayConversationsCount() {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split('T')[0] + '%';
    const query = 'SELECT COUNT(*) as count FROM conversations WHERE timestamp LIKE ?';
    db.get(query, [today], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count);
      }
    });
  });
}

// Funkcja do wyszukiwania w konwersacjach
function searchConversations(searchQuery) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, timestamp, user_message, assistant_response 
      FROM conversations 
      WHERE user_message LIKE ? OR assistant_response LIKE ? 
      ORDER BY timestamp DESC 
      LIMIT 50
    `;
    const searchPattern = `%${searchQuery}%`;
    db.all(query, [searchPattern, searchPattern], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  saveConversation,
  getLastConversations,
  getSetting,
  saveSetting,
  getConversationsWithPagination,
  getConversationsCount,
  getTodayConversationsCount,
  searchConversations
};