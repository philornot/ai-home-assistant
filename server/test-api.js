const fetch = require('node-fetch');

async function testChat() {
  try {
    console.log('Wysyłanie zapytania do API...');
    
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Cześć, jak się masz?'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Odpowiedź z API:');
    console.log(data);
  } catch (error) {
    console.error('Błąd podczas testowania API:', error);
  }
}

testChat();