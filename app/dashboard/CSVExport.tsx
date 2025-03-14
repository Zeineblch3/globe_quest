'use client';

import React from 'react';
import { FaDownload } from 'react-icons/fa';
import Papa from 'papaparse';

interface CSVExportProps {
    tours: any[];
    selectedTours: Set<string>;
    className?: string;
}

const CSVExport: React.FC<CSVExportProps> = ({ tours, selectedTours, className }) => {
    const handleExportCSV = () => {
        // Filter tours based on selection or export all
        const toursToExport = tours.filter(tour => selectedTours.has(tour.id));
        const exportData = toursToExport.length > 0 ? toursToExport : tours;

        // Define the structure of the CSV data
        const csvData = exportData.map(tour => ({
            Name: tour.name,
            Description: tour.description,
            Latitude: tour.latitude,
            Longitude: tour.longitude,
            'Photo URLs': tour.photo_urls.join(', '), // Join photo URLs with a comma
            Price: tour.price,
            'TripAdvisor Link': tour.tripAdvisor_link
        }));

        // Use PapaParse to convert the data to CSV
        const csv = Papa.unparse(csvData);

        // Create a Blob from the CSV data and trigger the download
        const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'tours.csv';
        link.click();
    };

    return (
        <button onClick={handleExportCSV} className={className}>
            <FaDownload className="mr-3" /> Export CSV
        </button>
    );
};

export default CSVExport;
