const Anthropic = require('@anthropic-ai/sdk');
const contextBuffer = require('./context-buffer');
const db = require('./db');
require('dotenv').config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Funkcja do generowania odpowiedzi używając Claude
async function generateResponse(context, message) {
  try {
    // Pobierz ustawienia
    const [personalityPrompt, model, temperatureStr, maxTokensStr] = await Promise.all([
      db.getSetting('personality_prompt'),
      db.getSetting('model'),
      db.getSetting('temperature'),
      db.getSetting('max_tokens')
    ]);
    
    // Ustaw domyślne wartości lub użyj zapisanych
    const modelToUse = model || "claude-3-haiku-20240307";
    const temperatureToUse = parseFloat(temperatureStr || "0.7");
    const maxTokensToUse = parseInt(maxTokensStr || "500", 10);
    const promptToUse = personalityPrompt || "Jesteś polskim asystentem domowym. Masz spersonalizowany styl mówienia, trochę jak przyjaciel. Odpowiadasz zwięźle i pomocnie.";
    
    // Formatuj kontekst
    const formattedContext = contextBuffer.formatContext(context);
    
    // Przygotuj wiadomości dla API
    const messages = [];
    
    // Dodaj kontekst poprzednich rozmów
    for (const msg of formattedContext) {
      messages.push(msg);
    }
    
    // Dodaj aktualne zapytanie
    messages.push({
      role: "user",
      content: message
    });
    
    // Wywołanie API Claude
    const response = await client.messages.create({
      model: modelToUse,
      max_tokens: maxTokensToUse,
      temperature: temperatureToUse,
      system: promptToUse,
      messages: messages
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error("Błąd podczas generowania odpowiedzi:", error);
    throw error;
  }
}

module.exports = {
  generateResponse
};