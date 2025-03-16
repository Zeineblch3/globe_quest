import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import Papa from 'papaparse';
import { jsPDF } from "jspdf";

interface ExportProps {
  tours: any[];
  selectedTours: Set<string>;
  className?: string;
}

const Export: React.FC<ExportProps> = ({ tours, selectedTours }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf' | null>(null);

  const handleExportCSV = () => {
    const toursToExport = tours.filter((tour) => selectedTours.has(tour.id));
    const exportData = toursToExport.length > 0 ? toursToExport : tours;

    const csvData = exportData.map((tour) => ({
      Name: tour.name,
      Description: tour.description,
      Latitude: tour.latitude,
      Longitude: tour.longitude,
      Price: tour.price,
      'TripAdvisor Link': tour.tripAdvisor_link,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tours.csv';
    link.click();
  };

  const handleExportPDF = () => {
    const toursToExport = tours.filter((tour) => selectedTours.has(tour.id));
    const exportData = toursToExport.length > 0 ? toursToExport : tours;

    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Tour List', 20, 20);

    let y = 30; // Starting position for the list of tours

    exportData.forEach((tour, index) => {
      doc.text(`${index + 1}. ${tour.name} - ${tour.price}`, 20, y);
      doc.text(`Description: ${tour.description}`, 20, y + 10);
      doc.text(`Location: ${tour.latitude}, ${tour.longitude}`, 20, y + 20);
      doc.text(`TripAdvisor Link: ${tour.tripAdvisor_link}`, 20, y + 30);
      y += 40; // Increase y to position the next tour's details below
    });

    doc.save('tours.pdf');
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
    <div className="flex justify-end">
      {/* Export Button */}
      <button
        type="button"
        className="bg-black text-white rounded-md p-2 flex items-center"
        onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown visibility
      >
        <FaDownload className="mr-2" /> Export as
      </button>

      {/* Dropdown Options */}
      {dropdownOpen && (
        <div className="absolute right-47 mt-0 w-40 rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {(['csv', 'pdf'] as const).map((format) => (
              <button
                key={format}
                onClick={() => handleExportClick(format)} // TypeScript knows 'format' is 'csv' or 'pdf'
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
