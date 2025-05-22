import { db } from './firebase'
import { collection, query, where, getDocs, addDoc, orderBy, limit } from 'firebase/firestore'

interface LeaderboardEntry {
  playerName: string
  score: number
  questionsAnswered: number
  timeElapsed: number
  mode: 'easy' | 'hard'
  timestamp: Date
}

interface Feedback {
  message: string
  rating: number
  timestamp: Date
  status: 'new' | 'in-progress' | 'completed'
  response?: string
}

// Check if a player already exists and compare scores
export const checkAndStoreScore = async (entry: Omit<LeaderboardEntry, 'timestamp'>): Promise<{ 
  success: boolean, 
  message: string,
  existingScore?: number 
}> => {
  try {
    // Query for existing entries with the same player name and mode
    const leaderboardRef = collection(db, 'leaderboard')
    const q = query(
      leaderboardRef, 
      where('playerName', '==', entry.playerName),
      where('mode', '==', entry.mode)
    )
    
    const querySnapshot = await getDocs(q)
    
    // If player exists, check if new score is higher
    if (!querySnapshot.empty) {
      const existingEntry = querySnapshot.docs[0].data() as LeaderboardEntry
      if (existingEntry.score >= entry.score) {
        return {
          success: false,
          message: `Your previous score of ${existingEntry.score} points was better!`,
          existingScore: existingEntry.score
        }
      }
    }
    
    // Store new score (either player doesn't exist or new score is higher)
    await addDoc(leaderboardRef, {
      ...entry,
      timestamp: new Date()
    })
    
    return {
      success: true,
      message: querySnapshot.empty 
        ? 'Score saved successfully!' 
        : 'New high score! Previous record broken!'
    }
  } catch (error) {
    console.error('Error checking/storing score:', error)
    return {
      success: false,
      message: 'Error saving score. Please try again.'
    }
  }
}

// Get top 10 scores for a specific mode
export const getTopScores = async (mode: 'easy' | 'hard'): Promise<LeaderboardEntry[]> => {
  try {
    const leaderboardRef = collection(db, 'leaderboard')
    const q = query(leaderboardRef, where('mode', '==', mode))
    const querySnapshot = await getDocs(q)
    
    const scores = querySnapshot.docs.map(doc => doc.data() as LeaderboardEntry)
    
    // Sort by score (descending) and use time as tiebreaker
    return scores
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score // First sort by score (descending)
        }
        return a.timeElapsed - b.timeElapsed // Then by time (ascending)
      })
      .slice(0, 10)
  } catch (error) {
    console.error('Error fetching top scores:', error)
    return []
  }
}

// Get a player's best score
export const getPlayerBestScore = async (playerName: string, mode: 'easy' | 'hard'): Promise<number | null> => {
  try {
    const leaderboardRef = collection(db, 'leaderboard')
    const q = query(
      leaderboardRef,
      where('playerName', '==', playerName),
      where('mode', '==', mode)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) return null
    
    const scores = querySnapshot.docs.map(doc => doc.data() as LeaderboardEntry)
    return Math.max(...scores.map(entry => entry.score))
  } catch (error) {
    console.error('Error fetching player best score:', error)
    return null
  }
}

export const submitFeedback = async (message: string, rating: number): Promise<{ success: boolean, message: string }> => {
  try {
    // Get reference to feedback collection
    const feedbackRef = collection(db, 'feedback')

    // Create the document
    const docRef = await addDoc(feedbackRef, {
      message,
      rating,
      timestamp: new Date(),
      status: 'new'
    })

    if (!docRef.id) {
      throw new Error('Failed to create feedback document')
    }
    
    return {
      success: true,
      message: 'Feedback submitted successfully!'
    }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error submitting feedback. Please try again.'
    }
  }
}

export const getLatestFeedback = async (count: number = 50): Promise<Feedback[]> => {
  try {
    const feedbackRef = collection(db, 'feedback')
    const q = query(
      feedbackRef,
      orderBy('timestamp', 'desc'),
      limit(count)
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(), // Handle potential missing timestamp
        rating: data.rating || 0, // Handle potential missing rating
        status: data.status || 'new', // Handle potential missing status
        message: data.message || '' // Handle potential missing message
      } as Feedback
    })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return []
  }
}
