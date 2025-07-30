export const formatAddress = (addr: string) => {
  if (!addr) return '-';

  const upperAfterLastTwo = addr.slice(0, 3) + addr.slice(2);
  return `${upperAfterLastTwo.substring(0, 5)}...${upperAfterLastTwo.substring(39)}`;
};
