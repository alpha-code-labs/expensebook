import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const ExcelDownload = ({ value1, value2, value3, value4, value5, value6 }) => {
  const handleExcelDownload = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([
      { 'Value 1': value1, 'Value 2': value2, 'Value 3': value3 },
      { 'Value 4': value4, 'Value 5': value5, 'Value 6': value6 },
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'data.xlsx');
  };

  return (
    <div className="flex flex-col items-start justify-start border-[1px] border-b-gray rounded-xl shadow-md p-4">
      <div className="grid grid-cols-3 gap-4 w-full">
        <div>
          <p className="font-cabin font-normal text-xs text-neutral-400">Value 1</p>
          <p className="lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate">
            {value1}
          </p>
        </div>
        <div>
          <p className="font-cabin font-normal text-xs text-neutral-400">Value 2</p>
          <p className="lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate">
            {value2}
          </p>
        </div>
        <div>
          <p className="font-cabin font-normal text-xs text-neutral-400">Value 3</p>
          <p className="lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate">
            {value3}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full mt-4">
        <div>
          <p className="font-cabin font-normal text-xs text-neutral-400">Value 4</p>
          <p className="lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate">
            {value4}
          </p>
        </div>
        <div>
          <p className="font-cabin font-normal text-xs text-neutral-400">Value 5</p>
          <p className="lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate">
            {value5}
          </p>
        </div>
        <div>
          <p className="font-cabin font-normal text-xs text-neutral-400">Value 6</p>
          <p className="lg:text-[14px] text-[16px] text-left font-medium tracking-[0.03em] text-neutral-800 font-cabin lg:truncate">
            {value6}
          </p>
        </div>
      </div>
      <button
        onClick={handleExcelDownload}
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Download Excel
      </button>
    </div>
  );
};

export default ExcelDownload;