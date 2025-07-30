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
export function formatFileName(fileName: string, max?: number): string {
  const maxChars = max || 25;
  if (String(fileName).length <= maxChars) return fileName;

  const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
  const mainPart = fileName.slice(0, fileName.lastIndexOf("."));

  const halfLength = Math.floor((maxChars - 3) / 2);

  const startPart = mainPart.slice(0, halfLength);
  const endPart = mainPart.slice(-halfLength);

  return `${startPart}...${endPart}.${fileExtension}`;
}
