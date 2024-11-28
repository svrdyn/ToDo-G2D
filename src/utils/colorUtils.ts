// Function to determine if a color is light or dark
export function isLightColor(color: string): boolean {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  // Using the formula from WCAG 2.0
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return true if the color is light (luminance > 0.5)
  return luminance > 0.5;
}

// Function to get contrasting text color
export function getContrastingTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#1a1a1a' : '#ffffff';
}