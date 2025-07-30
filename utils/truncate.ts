export function truncate(name: string, max: number, final_dot: boolean = true): string {
  const maxChars = max;
  if (String(name).length <= maxChars) return name;

  const fileExtension = name.slice(((name.lastIndexOf(".") - 1) >>> 0) + 2);
  const mainPart = name.slice(0, name.lastIndexOf("."));

  const halfLength = Math.floor((maxChars - 3) / 2);

  const startPart = mainPart.slice(0, halfLength);
  const endPart = mainPart.slice(-halfLength);

  const dot = final_dot ? "." : "";

  return `${startPart}...${endPart}${dot}${fileExtension}`;
}
