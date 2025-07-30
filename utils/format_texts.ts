/**
 * @title File Name Formatting Utility
 *
 * @notice Truncates and formats a file name if it exceeds a certain character limit.
 *
 * @dev If the provided file name exceeds the maximum character limit (set to 25 characters),
 * the function will truncate the name, ensuring that the file extension remains intact.
 * The truncated name will have the format "startPart...endPart.fileExtension".
 *
 * @param fileName The original name of the file.
 *
 * @return Formatted file name if it exceeds the character limit, or the original file name otherwise.
 */
export function truncate(name: string, max: number): string {
  const maxChars = max;
  if (String(name).length <= maxChars) return name;

  const fileExtension = name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2);
  const mainPart = name.slice(0, name.lastIndexOf('.'));

  const halfLength = Math.floor((maxChars - 3) / 2);

  const startPart = mainPart.slice(0, halfLength);
  const endPart = mainPart.slice(-halfLength);

  return `${startPart}...${endPart}.${fileExtension}`;
}

export function formatName(fullName: string) {
  const names = fullName.split(' ');

  if (names.length < 3) {
    return fullName;
  }

  const firstName = names[0];
  const middleInitial = names[1].charAt(0) + '.';
  const lastName = names[names.length - 1];

  const name = `${firstName} ${middleInitial} ${lastName}`;

  return name;
}

export function capitalizeWord(word: string) {
  return word.charAt(0).toLocaleUpperCase() + word.substring(1, word.length);
}
