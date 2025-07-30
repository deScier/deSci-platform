export function extractFileName(url: string | undefined): string {
  // Verificar se a URL foi fornecida
  if (!url) {
    // Se a URL é undefined ou vazia, retornar uma string vazia
    return 'no file name';
  }

  // Dividir a URL em partes usando '/' como separador
  const parts = url.split('/');

  // O nome do arquivo é o último elemento da array
  // Verificar se a array 'parts' tem elementos antes de tentar acessar
  return parts.length > 0 ? parts[parts.length - 1] : '';
}
