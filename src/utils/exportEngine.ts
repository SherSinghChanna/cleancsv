import * as XLSX from 'xlsx';

// 1. Excel एक्सपोर्ट फंक्शन
export function exportToExcel(headers: string[], rows: string[][], filename: string = 'cleaned_csv_data.xlsx') {
  const data = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "CleanedData");
  XLSX.writeFile(workbook, filename.replace(/\.[^/.]+$/, "") + ".xlsx");
}

// 2. JSON एक्सपोर्ट फंक्शन
export function exportToJSON(headers: string[], rows: string[][], filename: string = 'cleaned_csv_data.json') {
  const jsonData = rows.map(row => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });
    return obj;
  });

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(jsonData, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', filename.replace(/\.[^/.]+$/, "") + ".json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}