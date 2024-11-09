import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle, CheckCircle2, XCircle, Trash2, Upload } from 'lucide-react';
import { CSVUpload } from './CSVUpload';
import MetricCard from './MetricCard';
import FunnelChart from './FunnelChart';

interface CampaignMetric {
  id: number;
  name: string;
  spent: string;
  cpc: string;
  conversions: string;
  status: 'active' | 'warning' | 'stopped';
  notes: string;
  funnel?: {
    impressions: number;
    reach: number;
    clicks: number;
    checkoutInit: number;
    addToCart: number;
    results: number;
  };
}

export const CampaignMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<CampaignMetric[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('campaignMetrics');
    if (saved) setMetrics(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('campaignMetrics', JSON.stringify(metrics));
  }, [metrics]);

  const handleCSVUpload = (data: any[]) => {
    const newMetrics = data
      .map((row, index) => {
        if (!row['Nazwa zestawu reklam'] || 
            row['Nazwa zestawu reklam'].trim() === '' || 
            (parseFloat(row['Wydana kwota (PLN)']) === 0 && 
             parseInt(row['Wyniki']) === 0 && 
             parseFloat(row['CPC (wszystkie) (PLN)']) === 0)) {
          return null;
        }

        return {
          id: index + 1,
          name: row['Nazwa zestawu reklam'],
          spent: row['Wydana kwota (PLN)'] || '0',
          cpc: row['CPC (wszystkie) (PLN)'] || '0',
          conversions: row['Wyniki'] || '0',
          status: 'active',
          notes: '',
          funnel: {
            impressions: parseInt(row['Wyświetlenia']) || 0,
            reach: parseInt(row['Zasięg']) || 0,
            clicks: parseInt(row['Kliknięcia (wszystkie)']) || 0,
            checkoutInit: parseInt(row['Zainicjowanie finalizacji zakupu']) || 0,
            addToCart: parseInt(row['Dodanie do koszyka w witrynie']) || 0,
            results: parseInt(row['Wyniki']) || 0
          }
        };
      })
      .filter((metric): metric is CampaignMetric => 
        metric !== null && 
        (parseFloat(metric.spent) > 0 || 
         parseFloat(metric.cpc) > 0 || 
         parseInt(metric.conversions) > 0)
      );

    setMetrics(newMetrics);
  };

  const handleJSONUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        setMetrics(data);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
  };

  const clearData = () => {
    setMetrics([]);
    localStorage.removeItem('campaignMetrics');
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metamonitor_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-success/20 text-success border-success/20 hover:bg-success/30 dark:bg-success/30 dark:text-success dark:border-success/30 dark:hover:bg-success/40',
      warning: 'bg-warning/20 text-warning border-warning/20 hover:bg-warning/30 dark:bg-warning/30 dark:text-warning dark:border-warning/30 dark:hover:bg-warning/40',
      stopped: 'bg-destructive/20 text-destructive border-destructive/20 hover:bg-destructive/30 dark:bg-destructive/30 dark:text-destructive dark:border-destructive/30 dark:hover:bg-destructive/40'
    };
    return colors[status as keyof typeof colors] || 'bg-muted text-muted-foreground border-input hover:bg-muted/80';
  };

  const getActionRecommendation = (metric: CampaignMetric) => {
    const spent = parseFloat(metric.spent);
    const cpc = parseFloat(metric.cpc);
    const conversions = parseInt(metric.conversions);
    const costPerPurchase = conversions > 0 ? spent / conversions : 0;

    if (!spent || !cpc) return { text: 'WPROWADŹ DANE', icon: AlertTriangle, color: 'text-muted-foreground' };
    
    if (cpc <= 2 && costPerPurchase <= 29 && conversions >= 5) {
      return { text: 'SKALUJ', icon: CheckCircle2, color: 'text-success' };
    }
    if (cpc > 2 || costPerPurchase > 29) {
      return { text: 'ZATRZYMAJ', icon: XCircle, color: 'text-destructive' };
    }
    return { text: 'OBSERWUJ', icon: AlertTriangle, color: 'text-warning' };
  };

  const handleMetricChange = (id: number, field: string, value: string) => {
    setMetrics(metrics.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  if (metrics.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard title="Łączne wydatki" value="0,00 PLN" />
          <MetricCard title="Średnie CPC" value="0,00 PLN" />
          <MetricCard title="Łączne konwersje" value="0" />
          <MetricCard title="Aktywne kreacje" value="0/0" />
        </div>
        
        <div className="flex justify-center gap-4 p-8 border-2 border-dashed border-border rounded-lg bg-muted">
          <Button onClick={() => document.getElementById('csvInput')?.click()} className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Wgraj plik CSV
          </Button>
          <Button onClick={() => document.getElementById('jsonInput')?.click()} variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Wczytaj poprzednią analizę
          </Button>
          <input
            id="csvInput"
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const text = e.target?.result as string;
                  const [headers, ...rows] = text.split('\n')
                    .map(row => row.trim())
                    .filter(row => row.length > 0)
                    .map(row => {
                      const separator = row.includes(';') ? ';' : ',';
                      return row.split(separator).map(cell => cell.trim().replace(/^"|"$/g, ''));
                    });

                  if (!headers) return;

                  const data = rows.map(row => {
                    const rowData: any = {};
                    headers.forEach((header, index) => {
                      rowData[header] = row[index] || '';
                    });
                    return rowData;
                  });

                  handleCSVUpload(data);
                };
                reader.readAsText(file);
              }
            }}
            className="hidden"
          />
          <input
            id="jsonInput"
            type="file"
            accept=".json"
            onChange={handleJSONUpload}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Łączne wydatki"
          value={`${metrics.reduce((sum, m) => sum + (parseFloat(m.spent) || 0), 0).toFixed(2).replace('.', ',')} PLN`}
        />
        <MetricCard
          title="Średnie CPC"
          value={`${(metrics.reduce((sum, m) => sum + (parseFloat(m.cpc) || 0), 0) / metrics.filter(m => m.cpc).length || 0).toFixed(2).replace('.', ',')} PLN`}
        />
        <MetricCard
          title="Łączne konwersje"
          value={metrics.reduce((sum, m) => sum + (parseInt(m.conversions) || 0), 0)}
        />
        <MetricCard
          title="Aktywne kreacje"
          value={`${metrics.filter(m => m.status === 'active').length}/${metrics.length}`}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={clearData}
          variant="outline"
          className="flex items-center gap-2 bg-destructive/10 text-destructive hover:bg-destructive/20"
        >
          <Trash2 className="w-4 h-4" />
          Wyczyść dane
        </Button>
        <Button onClick={exportJSON} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Eksportuj JSON
        </Button>
      </div>

      <div className="space-y-6">
        {metrics.map((metric) => {
          const recommendation = getActionRecommendation(metric);
          const Icon = recommendation.icon;
          const costPerPurchase = parseInt(metric.conversions) > 0 
            ? parseFloat(metric.spent) / parseInt(metric.conversions)
            : 0;
          
          return (
            <Card key={metric.id} className="overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-foreground mb-4">{metric.name}</div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                          Wydatki (PLN)
                        </label>
                        <Input
                          type="number"
                          value={metric.spent}
                          onChange={(e) => handleMetricChange(metric.id, 'spent', e.target.value)}
                          className="shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                          CPC (PLN)
                        </label>
                        <Input
                          type="number"
                          value={metric.cpc}
                          onChange={(e) => handleMetricChange(metric.id, 'cpc', e.target.value)}
                          className="shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                          Konwersje
                        </label>
                        <Input
                          type="number"
                          value={metric.conversions}
                          onChange={(e) => handleMetricChange(metric.id, 'conversions', e.target.value)}
                          className="shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                          Koszt/Zakup (PLN)
                        </label>
                        <Input
                          type="number"
                          value={costPerPurchase.toFixed(2)}
                          readOnly
                          className="shadow-sm bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 md:items-end">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                        Status
                      </label>
                      <select
                        value={metric.status}
                        onChange={(e) => handleMetricChange(metric.id, 'status', e.target.value)}
                        className={`w-full min-w-[140px] h-10 rounded-md border px-3 shadow-sm transition-colors ${getStatusColor(metric.status)}`}
                      >
                        <option value="active">AKTYWNA</option>
                        <option value="warning">UWAGA</option>
                        <option value="stopped">STOP</option>
                      </select>
                    </div>
                    <div className={`flex items-center gap-2 min-w-[140px] px-4 py-2 rounded-md ${
                      recommendation.text === 'SKALUJ'
                        ? 'bg-success/20 text-success border-2 border-success dark:bg-success/30'
                        : recommendation.text === 'ZATRZYMAJ'
                        ? 'bg-destructive/20 text-destructive border border-destructive/20 dark:bg-destructive/30'
                        : recommendation.text === 'OBSERWUJ'
                        ? 'bg-warning/20 text-warning border border-warning/20 dark:bg-warning/30'
                        : 'bg-muted text-muted-foreground border border-input'
                    }`}>
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">
                        {recommendation.text}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Input
                    placeholder="Notatki..."
                    value={metric.notes}
                    onChange={(e) => handleMetricChange(metric.id, 'notes', e.target.value)}
                    className="w-full shadow-sm"
                  />
                </div>

                {metric.funnel && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Lejek sprzedażowy</h3>
                    <FunnelChart
                      steps={[
                        { label: 'Wyświetlenia', value: metric.funnel.impressions },
                        { label: 'Zasięg', value: metric.funnel.reach, previousValue: metric.funnel.impressions },
                        { label: 'Kliknięcia', value: metric.funnel.clicks, previousValue: metric.funnel.reach },
                        { label: 'Inicjacja zakupu', value: metric.funnel.checkoutInit, previousValue: metric.funnel.clicks },
                        { label: 'Dodanie do koszyka', value: metric.funnel.addToCart, previousValue: metric.funnel.checkoutInit },
                        { label: 'Wyniki', value: metric.funnel.results, previousValue: metric.funnel.addToCart }
                      ]}
                      maxValue={metric.funnel.impressions}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};