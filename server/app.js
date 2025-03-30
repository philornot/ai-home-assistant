const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./db');
// const claude = require('./claude'); // Tymczasowo wyłączone
const claude = require('./mock-ai');  // Używaj symulacji AI do testów
const logger = require('./logger');

// Konfiguracja .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Endpoint do rozmowy
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Brak wiadomości' });
    }
    
    logger.info(`Otrzymano zapytanie: ${message}`);
    
    // Pobierz ostatnie rozmowy jako kontekst
    const lastConversations = await db.getLastConversations(5);
    
    // Wygeneruj odpowiedź
    const response = await claude.generateResponse(lastConversations, message);
    
    // Zapisz rozmowę w bazie danych
    await db.saveConversation(message, response);
    
    logger.info(`Wygenerowano odpowiedź: ${response.substring(0, 50)}...`);
    
    // Zwróć odpowiedź
    res.json({ response });
  } catch (error) {
    logger.error('Błąd podczas obsługi zapytania:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas przetwarzania zapytania' });
  }
});

// Endpoint health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Endpoint do pobierania ustawień
app.get('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const value = await db.getSetting(key);
    
    if (value === null) {
      return res.status(404).json({ error: 'Ustawienie nie znalezione' });
    }
    
    res.json({ key, value });
  } catch (error) {
    logger.error('Błąd podczas pobierania ustawienia:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Endpoint do zapisywania ustawień
app.post('/settings', async (req, res) => {
  try {
    const { key, value } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({ error: 'Brak wymaganych danych' });
    }
    
    await db.saveSetting(key, value);
    res.json({ success: true, key, value });
  } catch (error) {
    logger.error('Błąd podczas zapisywania ustawienia:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Endpoint do pobierania historii konwersacji
app.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '20', 10);
    const offset = parseInt(req.query.offset || '0', 10);
    
    // Dodaj nową funkcję do db.js
    const history = await db.getConversationsWithPagination(limit, offset);
    const total = await db.getConversationsCount();
    
    res.json({
      history,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Błąd podczas pobierania historii:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania historii' });
  }
});

// Endpoint do wyszukiwania w historii
app.get('/history/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Brak parametru wyszukiwania' });
    }
    
    // Dodaj nową funkcję do db.js
    const results = await db.searchConversations(query);
    
    res.json({ results });
  } catch (error) {
    logger.error('Błąd podczas wyszukiwania:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas wyszukiwania' });
  }
});

// Endpoint do pobierania statystyk
app.get('/stats', async (req, res) => {
  try {
    // Dodaj nową funkcję do db.js
    const totalConversations = await db.getConversationsCount();
    const todayConversations = await db.getTodayConversationsCount();
    
    res.json({
      total: totalConversations,
      today: todayConversations,
      apiVersion: '1.0.0',
      uptime: process.uptime()
    });
  } catch (error) {
    logger.error('Błąd podczas pobierania statystyk:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania statystyk' });
  }
});

// Uruchomienie serwera
app.listen(PORT, () => {
  logger.info(`Serwer AI działa na porcie ${PORT}`);
});

module.exports = app;