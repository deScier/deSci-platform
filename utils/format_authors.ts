export function formatAuthors(authors: { id: string; name: string }[]): string {
  let totalChars = 0;
  let displayedAuthors = [];

  const authorsNames = authors.map((author) => author.name);

  if (authors.length > 3) {
    return `${authorsNames.slice(0, 3).join(', ')}, and ${authorsNames.length - 3} more authors`;
  }

  if (authorsNames.length > 1 && authorsNames.length <= 3) {
    return authorsNames.join(', ');
  }

  return authorsNames[0];
}
