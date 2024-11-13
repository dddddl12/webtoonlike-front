export function downloadAsPDF(url: string, filename: string) {
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}