import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

import { Card, CardContent } from './ui/card';
import { Download, FileText, Table, Code, Sparkles } from 'lucide-react';
import { Subject } from '../types';
import { exportToJSON, exportToCSV, exportToHTML } from '../utils/exportData';
import { toast } from 'react-hot-toast';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjects: Subject[];
}

export const ExportDialog = ({ open, onOpenChange, subjects }: ExportDialogProps) => {
  const [studentName, setStudentName] = useState('');
  const [exportFormat, setExportFormat] = useState('html');

  const handleExport = () => {
    try {
      switch (exportFormat) {
        case 'json':
          exportToJSON(subjects, studentName);
          toast.success('📄 JSON-Datei erstellt!');
          break;
        case 'csv':
          exportToCSV(subjects, studentName);
          toast.success('📊 CSV-Datei erstellt!');
          break;
        case 'html':
          exportToHTML(subjects, studentName);
          toast.success('🌟 HTML-Datei erstellt!');
          break;
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Fehler beim Export');
    }
  };

  const exportOptions = [
    {
      value: 'html',
      label: 'HTML (Schön formatiert)',
      icon: <Sparkles className="w-4 h-4" />,
      description: 'Eine wunderschön gestaltete HTML-Seite mit allen Noten'
    },
    {
      value: 'csv',
      label: 'CSV (Excel kompatibel)',
      icon: <Table className="w-4 h-4" />,
      description: 'Tabelle für Excel, Google Sheets oder Numbers'
    },
    {
      value: 'json',
      label: 'JSON (Datenformat)',
      icon: <Code className="w-4 h-4" />,
      description: 'Strukturierte Daten für andere Anwendungen'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Noten exportieren
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studentName">Name des Schülers/der Schülerin</Label>
            <Input
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Max Mustermann"
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label>Export-Format wählen</Label>
            <div className="space-y-2">
              {exportOptions.map((option) => (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    exportFormat === option.value ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setExportFormat(option.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 ml-6">
                      {option.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Was wird exportiert?</span>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Alle Fächer und Noten</li>
              <li>• Berechnete Fachnoten</li>
              <li>• Gesamtdurchschnitt</li>
              <li>• Datum und Beschreibungen</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleExport} className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Exportieren
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};