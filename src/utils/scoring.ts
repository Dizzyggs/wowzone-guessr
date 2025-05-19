export const calculateTimeBonus = (timeInSeconds: number): { bonus: number; message: string } => {
  if (timeInSeconds < 60) { // Under 1 minute
    return { bonus: 300, message: 'finishing under 1 minute' }
  } else if (timeInSeconds < 120) { // Under 2 minutes
    return { bonus: 200, message: 'finishing under 2 minutes' }
  } else if (timeInSeconds < 180) { // Under 3 minutes
    return { bonus: 150, message: 'finishing under 3 minutes' }
  } else if (timeInSeconds < 240) { // Under 4 minutes
    return { bonus: 100, message: 'finishing under 4 minutes' }
  } else if (timeInSeconds < 300) { // Under 5 minutes
    return { bonus: 50, message: 'finishing under 5 minutes' }
  }
  return { bonus: 0, message: '' }
} 