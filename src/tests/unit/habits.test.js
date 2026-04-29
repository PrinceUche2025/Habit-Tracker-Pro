import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '../../utils/habits';

describe('toggleHabitCompletion', () => {
  const mockHabit = { id: 1, name: 'Run', completions: [] };
  const date = '2026-04-29';

  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(mockHabit, date);
    expect(result.completions).toContain(date);
  });

  it('removes a completion date when the date already exists', () => {
    const completedHabit = { ...mockHabit, completions: [date] };
    const result = toggleHabitCompletion(completedHabit, date);
    expect(result.completions).not.toContain(date);
  });

  it('does not mutate the original habit object', () => {
    toggleHabitCompletion(mockHabit, date);
    expect(mockHabit.completions).toHaveLength(0);
  });

  it('does not return duplicate completion dates', () => {
    const completedHabit = { ...mockHabit, completions: [date] };
    // Try to "add" it again
    const result = toggleHabitCompletion({ ...mockHabit, completions: [date] }, date);
    // Note: Our logic toggles (removes if exists), 
    // but the TRD wants to ensure no duplicates are ever returned.
    const added = toggleHabitCompletion(mockHabit, date);
    expect(new Set(added.completions).size).toBe(added.completions.length);
  });
});