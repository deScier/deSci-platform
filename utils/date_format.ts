import { format, isValid, parseISO } from "date-fns";
/**
 * @title Date Format Utility
 * @notice This function takes an ISO formatted date string, converts it into a local date, and then formats it into a specific pattern.
 * @dev The function uses 'date-fns' for date parsing and formatting. It accounts for timezone offsets when converting to a local date.
 * @param dataString The ISO formatted date string that needs to be formatted.
 * @return A string representing the local date in the 'dd/MM/yyyy HH:mm' format.
 */
export function formatDate(dataString: string): string {
  const data = parseISO(dataString);

  if (!isValid(data)) {
    return dataString;
  }

  const dataLocal = new Date(data.getTime() - data.getTimezoneOffset() * 60 * 1000);
  const dataFormatada = format(dataLocal, "dd/MM/yyyy");
  return dataFormatada;
}
