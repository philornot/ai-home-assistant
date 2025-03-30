/**
 * Moduł do zarządzania kontekstem rozmowy
 */

const MAX_CONTEXT_LENGTH = 3000; // Maksymalna długość kontekstu w znakach
const MAX_MESSAGES = 10; // Maksymalna liczba wiadomości w kontekście

/**
 * Formatuje kontekst dla Claude API
 * @param {Array} conversations - Tablica obiektów konwersacji
 * @returns {Array} - Tablica wiadomości dla Claude API
 */
function formatContext(conversations) {
  let formattedMessages = [];
  let contextLength = 0;
  
  // Odwróć kolejność, aby najpierw przetworzyć najnowsze wiadomości
  const reversedConversations = [...conversations].reverse();
  
  for (const conv of reversedConversations) {
    const userMessage = {
      role: "user",
      content: conv.user_message
    };
    
    const assistantMessage = {
      role: "assistant",
      content: conv.assistant_response
    };
    
    const userLength = conv.user_message.length;
    const assistantLength = conv.assistant_response.length;
    
    // Sprawdź, czy dodanie tych wiadomości nie przekroczy limitu
    if (contextLength + userLength + assistantLength > MAX_CONTEXT_LENGTH) {
      break;
    }
    
    // Dodaj wiadomości na początek, aby zachować kolejność chronologiczną
    formattedMessages.unshift(assistantMessage);
    formattedMessages.unshift(userMessage);
    
    contextLength += userLength + assistantLength;
    
    // Sprawdź, czy osiągnęliśmy limit liczby wiadomości
    if (formattedMessages.length >= MAX_MESSAGES * 2) {
      break;
    }
  }
  
  return formattedMessages;
}

module.exports = {
  formatContext
};