import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface CSVUploadProps {
  onUpload: (data: any[]) => void;
}

export const CSVUpload: React.FC<CSVUploadProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const [headers, ...rows] = text.split('\n')
        .map(row => row.trim())
        .filter(row => row.length > 0)
        .map(row => {
          const separator = row.includes(';') ? ';' : ',';
          return row.split(separator).map(cell => 
            cell.trim().replace(/^"|"$/g, '')
          );
        });

      if (!headers || !validateCSV(headers)) return;

      const data = rows.map(row => {
        const rowData: any = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] || '';
        });
        return rowData;
      });

      onUpload(data);
    };
    reader.readAsText(file);
  };

  const validateCSV = (headers: string[]): boolean => {
    const requiredColumns = [
      'Nazwa zestawu reklam',
      'Wydana kwota (PLN)',
      'Wyniki',
      'Dodanie do koszyka w witrynie',
      'Zainicjowanie finalizacji zakupu',
      'Kliknięcia (wszystkie)',
      'Zasięg',
      'Wyświetlenia',
      'CPC (wszystkie) (PLN)'
    ];

    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      alert(`Brakujące kolumny w pliku CSV: ${missingColumns.join(', ')}`);
      return false;
    }
    return true;
  };

  return (
    <div className="flex justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted">
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Wgraj plik CSV
      </Button>
    </div>
  );
};

export default CSVUpload;