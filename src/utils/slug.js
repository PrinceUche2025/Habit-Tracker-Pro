export const getHabitSlug = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // Remove non-alphanumeric except hyphens/spaces
    .replace(/[\s_-]+/g, '-')      // Collapse spaces/underscores into a single hyphen
    .replace(/^-+|-+$/g, '');      // Trim hyphens from ends
};