import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

function generateExcelTemplate(columns, data) {
 
  console.log(columns, data, '...columns')

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Add headers and data
  worksheet.columns = columns;
  
  {data.length>0 && data.forEach((row) => {
    worksheet.addRow(row);
  });}

  // Create a buffer with the Excel data
  return workbook.xlsx.writeBuffer();
}

export default function DownloadTemplate(props) {
  const columns = props.columns
  const data = props.data

  console.log(columns, data, '...columns.....')

  const handleDownload = async () => {
    try {
      const buffer = await generateExcelTemplate(columns, data);
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, 'HrExcelFormat.xlsx');
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  };

  return (
    <a
      className="curosr-pointer text-indigo-600 text-sm font-normal font-cabin underline"
      onClick={handleDownload}
    >
      Download HR template
    </a>
  );
}


