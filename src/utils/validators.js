export const validateHabitName = (name) => {
  if (!name || name.trim().length === 0) {
    return { error: 'Habit name cannot be empty', value: '' };
  }
  
  if (name.length > 50) {
    return { error: 'Habit name must be under 50 characters', value: name };
  }

  return { error: null, value: name.trim() };
};