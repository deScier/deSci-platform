export function ErrorMessage({ error, message }: { error: any; message: string }) {
  if (error == 'invalid_type' || error == 'too_small') {
    return message;
  }
  return null;
}
