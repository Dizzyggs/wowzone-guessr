import { db } from './firebase'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  limit,
  doc,
  updateDoc,
  increment,
  deleteDoc
} from 'firebase/firestore'

interface LeaderboardEntry {
  playerName: string
  score: number
  questionsAnswered: number
  timeElapsed: number
  mode: 'easy' | 'hard'
  timestamp: Date
}

interface Feedback {
  id?: string
  message: string
  rating: number
  timestamp: Date
  status: 'new' | 'in-progress' | 'completed'
  response?: string
  responseDate?: Date | null
}

interface Changelog {
  id?: string
  title: string
  added?: string
  changed?: string
  removed?: string
  date: Date
  type: 'feature' | 'bugfix' | 'improvement'
  likes?: number
  isDraft?: boolean
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

// Get all scores for a specific mode
export const getTopScores = async (mode: 'easy' | 'hard'): Promise<LeaderboardEntry[]> => {
  try {
    const leaderboardRef = collection(db, 'leaderboard')
    const q = query(leaderboardRef, where('mode', '==', mode))
    const querySnapshot = await getDocs(q)
    
    const scores = querySnapshot.docs.map(doc => doc.data() as LeaderboardEntry)
    
    // Sort by score (descending) and use time as tiebreaker
    return scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score // First sort by score (descending)
      }
      return a.timeElapsed - b.timeElapsed // Then by time (ascending)
    })
  } catch (error) {
    console.error('Error fetching scores:', error)
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
        timestamp: data.timestamp?.toDate() || new Date(),
        rating: data.rating || 0,
        status: data.status || 'new',
        message: data.message || ''
      } as Feedback
    })
  } catch (error) {
    console.error('Error fetching feedback:', error)
    return []
  }
}

export const getAdminStats = async () => {
  try {
    // Get total players (unique player names from leaderboard)
    const leaderboardRef = collection(db, 'leaderboard')
    const leaderboardSnapshot = await getDocs(leaderboardRef)
    const uniquePlayers = new Set(leaderboardSnapshot.docs.map(doc => doc.data().playerName))

    // Get feedback stats
    const feedbackRef = collection(db, 'feedback')
    const feedbackSnapshot = await getDocs(feedbackRef)
    const feedbackCount = feedbackSnapshot.docs.length
    const totalRating = feedbackSnapshot.docs.reduce((sum, doc) => sum + (doc.data().rating || 0), 0)
    const averageRating = feedbackCount > 0 ? (totalRating / feedbackCount).toFixed(1) : '0.0'

    return {
      totalPlayers: uniquePlayers.size,
      feedbackCount,
      averageRating
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return {
      totalPlayers: 0,
      feedbackCount: 0,
      averageRating: '0.0'
    }
  }
}

export const submitChangelog = async (
  title: string,
  type: 'feature' | 'bugfix' | 'improvement',
  sections: {
    added?: string
    changed?: string
    removed?: string
  }
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!title || (!sections.added && !sections.changed && !sections.removed)) {
      throw new Error('Title and at least one section are required')
    }

    // Create document data with only defined fields
    const docData: any = {
      title,
      type,
      date: new Date(),
      isDraft: false, // Explicitly set isDraft to false for published changelogs
      likes: 0 // Initialize likes counter
    }

    // Only add sections that have content
    if (sections.added?.trim()) {
      docData.added = sections.added.trim()
    }
    if (sections.changed?.trim()) {
      docData.changed = sections.changed.trim()
    }
    if (sections.removed?.trim()) {
      docData.removed = sections.removed.trim()
    }

    const changelogRef = collection(db, 'changelogs')
    const docRef = await addDoc(changelogRef, docData)

    if (!docRef.id) {
      throw new Error('Failed to create changelog entry')
    }

    return {
      success: true,
      message: 'Changelog entry created successfully!'
    }
  } catch (error) {
    console.error('Error creating changelog:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error creating changelog. Please try again.'
    }
  }
}

export const getChangelogs = async (count: number = 50): Promise<Changelog[]> => {
  try {
    const changelogRef = collection(db, 'changelogs')
    const q = query(
      changelogRef,
      orderBy('date', 'desc'),
      limit(count)
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs
      .map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title || '',
          added: data.added || '',
          changed: data.changed || '',
          removed: data.removed || '',
          date: data.date?.toDate() || new Date(),
          type: data.type || 'improvement',
          likes: data.likes || 0,
          isDraft: data.isDraft || false
        } as Changelog
      })
      .filter(changelog => !changelog.isDraft) // Filter out drafts in memory
  } catch (error) {
    console.error('Error fetching changelogs:', error)
    return []
  }
}

export const respondToFeedback = async (
  feedbackId: string,
  response: string,
  status: 'new' | 'in-progress' | 'completed'
): Promise<{ success: boolean; message: string }> => {
  try {
    const feedbackRef = collection(db, 'feedback')
    const docRef = doc(feedbackRef, feedbackId)
    
    await updateDoc(docRef, {
      response,
      status,
      responseDate: new Date()
    })

    return {
      success: true,
      message: 'Response added successfully!'
    }
  } catch (error) {
    console.error('Error adding response:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error adding response. Please try again.'
    }
  }
}

export const getPaginatedFeedback = async (
  page: number = 1,
  perPage: number = 5
): Promise<{ feedback: Feedback[]; total: number }> => {
  try {
    const feedbackRef = collection(db, 'feedback')
    
    // Get total count
    const snapshot = await getDocs(feedbackRef)
    const total = snapshot.size

    // Get paginated data
    const q = query(
      feedbackRef,
      orderBy('timestamp', 'desc'),
      limit(perPage * page) // Get all documents up to the current page
    )
    
    const querySnapshot = await getDocs(q)
    const allDocs = querySnapshot.docs

    // Get the last perPage documents
    const startIndex = (page - 1) * perPage
    const paginatedDocs = allDocs.slice(startIndex, startIndex + perPage)
    
    const feedback = paginatedDocs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
      responseDate: doc.data().responseDate?.toDate() || null
    })) as Feedback[]

    return { feedback, total }
  } catch (error) {
    console.error('Error fetching paginated feedback:', error)
    return { feedback: [], total: 0 }
  }
}

export const updateChangelogLikes = async (changelogId: string, shouldIncrement: boolean): Promise<void> => {
  try {
    const changelogRef = doc(db, 'changelogs', changelogId)
    await updateDoc(changelogRef, {
      likes: shouldIncrement ? increment(1) : increment(-1)
    })
  } catch (error) {
    console.error('Error updating changelog likes:', error)
    throw error
  }
}

export const submitChangelogDraft = async (
  title: string,
  type: 'feature' | 'bugfix' | 'improvement',
  sections: {
    added?: string
    changed?: string
    removed?: string
  }
): Promise<{ success: boolean; message: string }> => {
  try {
    const docData: any = {
      title,
      type,
      date: new Date(),
      isDraft: true
    }

    if (sections.added?.trim()) {
      docData.added = sections.added.trim()
    }
    if (sections.changed?.trim()) {
      docData.changed = sections.changed.trim()
    }
    if (sections.removed?.trim()) {
      docData.removed = sections.removed.trim()
    }

    const changelogRef = collection(db, 'changelogs')
    await addDoc(changelogRef, docData)

    return {
      success: true,
      message: 'Changelog draft saved successfully!'
    }
  } catch (error) {
    console.error('Error saving changelog draft:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error saving draft. Please try again.'
    }
  }
}

export const getDraftChangelogs = async (): Promise<Changelog[]> => {
  try {
    const changelogRef = collection(db, 'changelogs')
    const q = query(
      changelogRef,
      orderBy('date', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const allChangelogs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date()
    })) as Changelog[]
    
    return allChangelogs.filter(changelog => changelog.isDraft === true)
  } catch (error) {
    console.error('Error fetching draft changelogs:', error)
    return []
  }
}

export const publishChangelog = async (changelogId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const changelogRef = doc(db, 'changelogs', changelogId)
    await updateDoc(changelogRef, {
      isDraft: false,
      date: new Date() // Update the date to publication time
    })

    return {
      success: true,
      message: 'Changelog published successfully!'
    }
  } catch (error) {
    console.error('Error publishing changelog:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error publishing changelog. Please try again.'
    }
  }
}

export const updateDraftChangelog = async (
  changelogId: string,
  data: {
    title: string,
    type: 'feature' | 'bugfix' | 'improvement',
    added?: string,
    changed?: string,
    removed?: string
  }
): Promise<{ success: boolean; message: string }> => {
  try {
    const changelogRef = doc(db, 'changelogs', changelogId)
    
    // Create update object with only defined fields
    const updateData: any = {
      title: data.title,
      type: data.type,
      date: new Date() // Update the modification date
    }

    // Only add sections that have content
    if (data.added?.trim()) {
      updateData.added = data.added.trim()
    }
    if (data.changed?.trim()) {
      updateData.changed = data.changed.trim()
    }
    if (data.removed?.trim()) {
      updateData.removed = data.removed.trim()
    }

    await updateDoc(changelogRef, updateData)

    return {
      success: true,
      message: 'Draft updated successfully!'
    }
  } catch (error) {
    console.error('Error updating draft:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error updating draft. Please try again.'
    }
  }
}

export const updatePublishedChangelog = async (
  changelogId: string,
  data: {
    title: string,
    type: 'feature' | 'bugfix' | 'improvement',
    added?: string,
    changed?: string,
    removed?: string
  }
): Promise<{ success: boolean; message: string }> => {
  try {
    const changelogRef = doc(db, 'changelogs', changelogId)
    
    // Update the document with new data
    await updateDoc(changelogRef, {
      title: data.title,
      type: data.type,
      ...(data.added !== undefined && { added: data.added }),
      ...(data.changed !== undefined && { changed: data.changed }),
      ...(data.removed !== undefined && { removed: data.removed }),
      lastModified: new Date() // Add a lastModified timestamp
    })

    return {
      success: true,
      message: 'Changelog updated successfully'
    }
  } catch (error) {
    console.error('Error updating published changelog:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error updating changelog'
    }
  }
}

export const deleteFeedback = async (feedbackId: string): Promise<{ success: boolean, message: string }> => {
  try {
    const feedbackRef = doc(db, 'feedback', feedbackId)
    await deleteDoc(feedbackRef)
    
    return {
      success: true,
      message: 'Feedback deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting feedback:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error deleting feedback'
    }
  }
}
