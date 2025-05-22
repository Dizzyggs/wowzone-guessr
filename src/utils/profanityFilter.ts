// Common inappropriate words list - kept minimal for demonstration
const inappropriateWords = [
  'fuck', 'ass', 'bitch', 'damn', 'crap', 'piss', 'nigger', 'nigga', 'fag', 'faggot'
  // Add more words as needed
]

// Helper function to escape special characters in regex
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Create a regex pattern for whole word matching
const createWordBoundaryPattern = (word: string) => {
  return new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi')
}

export const containsProfanity = (text: string): { hasProfanity: boolean; cleanText: string } => {
  let modifiedText = text.toLowerCase()
  let hasProfanity = false

  // Check for exact matches with word boundaries
  for (const word of inappropriateWords) {
    const pattern = createWordBoundaryPattern(word)
    if (pattern.test(modifiedText)) {
      hasProfanity = true
      modifiedText = modifiedText.replace(pattern, '*'.repeat(word.length))
    }
  }

  // Check for intentional obfuscation (like f*ck, s#it, etc.)
  const obfuscationPattern = /\b[a-z]*[\*\$\@\#\!\%\&][a-z]*\b/gi
  if (obfuscationPattern.test(text)) {
    hasProfanity = true
  }

  return {
    hasProfanity,
    cleanText: hasProfanity ? modifiedText : text
  }
}

// Function to clean the text by replacing profanity with asterisks
export const cleanProfanity = (text: string): string => {
  let cleanText = text.toLowerCase()
  
  for (const word of inappropriateWords) {
    const pattern = createWordBoundaryPattern(word)
    cleanText = cleanText.replace(pattern, '*'.repeat(word.length))
  }

  return cleanText
} 