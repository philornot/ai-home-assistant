/**
 * Moduł symulujący AI dla celów testowych bez potrzeby używania zewnętrznego API
 */
const logger = require('./logger');

// Podstawowe odpowiedzi dla typowych pytań
const COMMON_RESPONSES = {
  'cześć': 'Cześć! Jak mogę Ci dzisiaj pomóc?',
  'hej': 'Hej! W czym mogę Ci asystować?',
  'dzień dobry': 'Dzień dobry! Jak się masz?',
  'jak się masz': 'Dziękuję, mam się dobrze! Jestem gotowy do pomocy. Co mogę dla Ciebie zrobić?',
  'co potrafisz': 'Mogę odpowiadać na pytania, pomagać w organizacji zadań, przypominać o ważnych sprawach, a także integrować się z Twoim systemem inteligentnego domu. Co Cię interesuje?',
  'pomoc': 'Jestem Twoim asystentem domowym. Mogę odpowiadać na pytania, pomagać w zarządzaniu zadaniami i łączyć się z urządzeniami smart home. W czym mogę pomóc?'
};

/**
 * Funkcja do generowania odpowiedzi na podstawie wzorców
 * @param {Array} context - Historia konwersacji
 * @param {string} message - Wiadomość od użytkownika
 * @returns {string} - Odpowiedź asystenta
 */
async function generateResponse(context, message) {
  logger.info('Mock AI generuje odpowiedź...');
  
  try {
    // Konwertuj wiadomość do małych liter do celów porównawczych
    const lowerCaseMessage = message.toLowerCase();
    
    // Sprawdź, czy mamy gotową odpowiedź dla tej wiadomości
    for (const [key, response] of Object.entries(COMMON_RESPONSES)) {
      if (lowerCaseMessage.includes(key)) {
        return response;
      }
    }
    
    // Sprawdź, czy wiadomość dotyczy historii konwersacji
    if (lowerCaseMessage.includes('historia') || lowerCaseMessage.includes('pamiętasz')) {
      if (context && context.length > 0) {
        return `Tak, pamiętam nasze wcześniejsze rozmowy. Ostatnio rozmawialiśmy o "${context[0].user_message}".`;
      } else {
        return "Nie mamy jeszcze wspólnej historii rozmów. O czym chciałbyś porozmawiać?";
      }
    }
    
    // Sprawdź, czy wiadomość dotyczy domu
    if (lowerCaseMessage.includes('dom') || 
        lowerCaseMessage.includes('światło') || 
        lowerCaseMessage.includes('temperatura')) {
      return "Mogę pomóc w zarządzaniu Twoim inteligentnym domem. Niestety, na razie jestem w trybie testowym i nie mam połączenia z systemem Home Assistant.";
    }
    
    // Sprawdź, czy to pytanie
    if (lowerCaseMessage.includes('?') || 
        lowerCaseMessage.startsWith('co') || 
        lowerCaseMessage.startsWith('jak') || 
        lowerCaseMessage.startsWith('gdzie') || 
        lowerCaseMessage.startsWith('kiedy') || 
        lowerCaseMessage.startsWith('dlaczego')) {
      return "To interesujące pytanie. W trybie testowym mam ograniczoną wiedzę, ale gdy połączysz mnie z prawdziwym API, będę mógł udzielić szczegółowej odpowiedzi.";
    }
    
    // Domyślna odpowiedź
    return "Rozumiem. Obecnie działam w trybie testowym bez połączenia z API Claude. Po pełnej integracji z API będę mógł udzielać bardziej szczegółowych i spersonalizowanych odpowiedzi.";
  } catch (error) {
    logger.error("Błąd podczas generowania odpowiedzi:", error);
    return "Przepraszam, wystąpił błąd podczas generowania odpowiedzi. Spróbuj ponownie później.";
  }
}

module.exports = {
  generateResponse
};