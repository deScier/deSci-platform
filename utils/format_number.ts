export function addNumberSuffix(value: number) {
  if (value >= 1e12) {
    return (value / 1e12).toFixed(1).replace(/\.0$/, "") + "T";
  } else if (value >= 1e9) {
    return (value / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  } else {
    return value.toString();
  }
}
