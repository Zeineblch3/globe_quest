import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import Papa from 'papaparse';
import { jsPDF } from "jspdf";

interface ColumnDefinition {
  key: string;
  label: string;
}

interface ExportProps {
  data: any[]; // the data to export
  columns: ColumnDefinition[]; // define which columns (key and header) to export
  fileName: string;
  className?: string;
}

const Export: React.FC<ExportProps> = ({ data, columns, fileName, className }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);

  const handleExportCSV = () => {
    // Map data using the provided columns
    const exportData = data.map((item) => {
      const mapped: any = {};
      columns.forEach((col) => {
        mapped[col.label] = item[col.key];
      });
      return mapped;
    });

    const csv = Papa.unparse(exportData);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`${fileName} Export`, 20, 20);
    let y = 30;

    data.forEach((item, index) => {
      let line = `${index + 1}. `;
      columns.forEach((col) => {
        line += `${col.label}: ${item[col.key]}  `;
      });
      doc.text(line, 20, y);
      y += 10;
    });

    doc.save(`${fileName}.pdf`);
  };

  const handleExportClick = (type: 'csv' | 'pdf') => {
    setExportType(type);
    setDropdownOpen(false); // Close the dropdown after selection
    if (type === 'csv') {
      handleExportCSV();
    } else if (type === 'pdf') {
      handleExportPDF();
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        className="bg-black text-white rounded-md p-0 flex items-center"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <FaDownload className="mr-2" /> Export as
      </button>

      {dropdownOpen && (
        <div className="absolute right-47 mt-2 w-40 rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {(['csv', 'pdf'] as const).map((format) => (
              <button
                key={format}
                onClick={() => handleExportClick(format)}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Export;
