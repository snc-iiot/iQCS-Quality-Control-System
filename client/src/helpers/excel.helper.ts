import * as XLSX from "xlsx";

interface IExcelData {
  [key: string]: any;
}

interface IExcelHelper {
  parseExcelData: (file: File) => Promise<IExcelData[]>;
  downloadExcelData: (data: IExcelData[], fileName: string) => void;
}

export class ExcelHelper implements IExcelHelper {
  parseExcelData = async (file: File): Promise<IExcelData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e?.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX?.utils?.sheet_to_json(sheet);
        resolve(parsedData as IExcelData[]);
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  downloadExcelData = (data: IExcelData[], fileName: string) => {
    const headers = Object.keys(data[0]);
    const ws = XLSX.utils.json_to_sheet(data, {
      header: headers,
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };
}
