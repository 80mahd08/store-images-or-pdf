export function convertBytesToReadable(sizeInBytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;

  // Convert bytes to the appropriate unit
  while (sizeInBytes >= 1024 && unitIndex < units.length - 1) {
    sizeInBytes /= 1024;
    unitIndex++;
  }

  // Format the string with 2 decimal places
  return `${sizeInBytes.toFixed(2)}${units[unitIndex]}`;
}
