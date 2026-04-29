export const calculateCurrentStreak = (completions) => {
  if (!completions || completions.length === 0) return 0;

  // Sort dates descending (newest first)
  const sortedDates = [...new Set(completions)].sort((a, b) => new Date(b) - new Date(a));
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If today isn't completed and yesterday isn't completed, streak is 0
  if (sortedDates[0] !== today && sortedDates[0] !== yesterdayStr) return 0;

  let streak = 0;
  let currentDate = new Date(sortedDates[0]);

  for (let i = 0; i < sortedDates.length; i++) {
    const completionDate = new Date(sortedDates[i]);
    
    // Check if this date is exactly the day we expect in the sequence
    if (i > 0) {
      const prevDate = new Date(sortedDates[i - 1]);
      const diff = (prevDate - completionDate) / (1000 * 60 * 60 * 24);
      if (diff !== 1) break; // Streak broken
    }
    
    streak++;
  }

  return streak;
};