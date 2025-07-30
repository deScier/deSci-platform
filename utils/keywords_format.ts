export function keywordsArray(inputString: string) {
  if (inputString === '') return [];

  return inputString?.split(';');
}
