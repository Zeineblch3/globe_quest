import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import Papa from 'papaparse';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';


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
    // Use landscape for more horizontal space
    const doc = new jsPDF({ orientation: 'landscape' });
  
    // Prepare columns and rows
    const tableColumn = columns.map(col => col.label);
    const tableRows = data.map(item =>
      columns.map(col => {
        const value = item[col.key];
        return typeof value === 'string' || typeof value === 'number'
          ? value
          : JSON.stringify(value);
      })
    );
  
    // Title
    doc.setFontSize(12);
    doc.text(`${fileName} Export`, 14, 15);
  
    // Table with controlled column widths
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak', // Break lines when necessary
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: 255,
        halign: 'center',
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 20, left: 14, right: 14 },
  
      // Custom column widths
      columnStyles: {
        0: { cellWidth: 20 }, // Name column width
        1: { cellWidth: 50 }, // Description column width
        2: { cellWidth: 20 }, // Price column width
        3: { cellWidth: 50 }, // Link column width
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
        7: { cellWidth: 20 },
      },
  
      // Automatically adjust table width to fit within the page
      tableWidth: 'auto',
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