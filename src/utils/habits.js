export const toggleHabitCompletion = (habit, date) => {
  const completions = habit.completions || [];
  const isCompleted = completions.includes(date);

  const newCompletions = isCompleted
    ? completions.filter((d) => d !== date)
    : [...completions, date];

  return {
    ...habit,
    completions: [...new Set(newCompletions)], // Ensures no duplicates
  };
};