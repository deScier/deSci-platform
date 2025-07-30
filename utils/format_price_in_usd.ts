/**
 * @title US Dollar Price Formatter
 * @notice This function formats a number into the US Dollar (USD) currency format.
 * @dev The function leverages the built-in `Intl.NumberFormat` to format the number value into a currency representation specific to the 'en-US' locale. It returns the number formatted as a US Dollar ($) currency string.
 * @param value The number that needs to be formatted into USD currency.
 * @return A string representing the formatted value in US Dollar (USD) currency format.
 */
function formatPriceInUSD(value: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default formatPriceInUSD;
