import * as XLSX from 'xlsx';

export function exportDataAsExcel(cleanedData: any[], fileName: string = 'cleaned_csv_data.xlsx') {
  const worksheet = XLSX.utils.json_to_sheet(cleanedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "CleanedData");
  XLSX.writeFile(workbook, fileName);
}

export function exportDataAsJSON(cleanedData: any[], fileName: string = 'cleaned_csv_data.json') {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(cleanedData, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}