const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testClaude() {
  try {
    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307', // Używaj tańszego modelu do testów
      max_tokens: 500,
      system: "Jesteś polskim asystentem domowym.",
      messages: [
        {
          role: 'user',
          content: "Dzień dobry! Jak się masz?"
        }
      ]
    });
    
    console.log("Odpowiedź Claude:", response.content[0].text);
  } catch (error) {
    console.error("Błąd podczas komunikacji z Claude:", error);
  }
}

testClaude();