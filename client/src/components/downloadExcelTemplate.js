import React from 'react';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

function generateExcelTemplate() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Add headers and data
  worksheet.addRow(['Company', 'Employees', 'Groups']);
  // Add more data rows as needed

  // Create a buffer with the Excel data
  return workbook.xlsx.writeBuffer();
}

function DownloadTemplate() {
  const handleDownload = async () => {
    try {
      const buffer = await generateExcelTemplate();
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, 'HrExcelFormat.xlsx');
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  };

  return (
    <a
      className="underline cursor-pointer relative text-eb-primary-blue-500"
      onClick={handleDownload}
    >
      Download HR template
    </a>
  );
}

export default DownloadTemplate;
