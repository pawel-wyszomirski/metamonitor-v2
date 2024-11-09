import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';

interface MatrixSettings {
  maxCPC: number;
  maxCost: number;
  minPurchases: number;
}

export const DecisionMatrix: React.FC = () => {
  const [settings, setSettings] = useState<MatrixSettings>({
    maxCPC: 2,
    maxCost: 29,
    minPurchases: 5
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Zasady skalowania</h2>
            <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
              <Info className="w-4 h-4" />
              <span>Minimum {settings.minPurchases} zakupów wymagane do skalowania</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Maksymalne CPC (PLN)
              </label>
              <Input
                type="number"
                value={settings.maxCPC}
                onChange={(e) => setSettings({ ...settings, maxCPC: parseFloat(e.target.value) })}
                className="shadow-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Maksymalny koszt zakupu (PLN)
              </label>
              <Input
                type="number"
                value={settings.maxCost}
                onChange={(e) => setSettings({ ...settings, maxCost: parseFloat(e.target.value) })}
                className="shadow-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Minimalna liczba zakupów
              </label>
              <Input
                type="number"
                value={settings.minPurchases}
                onChange={(e) => setSettings({ ...settings, minPurchases: parseInt(e.target.value) })}
                className="shadow-sm"
              />
            </div>
          </div>

          <div className="p-6 bg-muted rounded-xl">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-2 grid grid-cols-2 gap-6">
                <div className="text-center p-3 bg-card rounded-lg shadow-sm">
                  <div className="font-bold text-success">Niskie CPC</div>
                  <div className="text-sm text-success mt-1">≤{settings.maxCPC} PLN</div>
                </div>
                <div className="text-center p-3 bg-card rounded-lg shadow-sm">
                  <div className="font-bold text-destructive">Wysokie CPC</div>
                  <div className="text-sm text-destructive mt-1">&gt;{settings.maxCPC} PLN</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-card rounded-lg shadow-sm w-full">
                  <div className="font-bold text-success">Niski koszt</div>
                  <div className="text-sm text-success mt-1">≤{settings.maxCost} PLN</div>
                </div>
              </div>
              <div className="bg-success/20 dark:bg-success/30 p-6 rounded-xl shadow-sm border-2 border-success hover:bg-success/30 dark:hover:bg-success/40 transition-colors">
                <div className="font-bold text-success text-xl text-center mb-2">SKALUJ</div>
                <div className="text-sm text-success text-center">
                  (gdy ≥{settings.minPurchases} zakupów)
                </div>
              </div>
              <div className="bg-warning/20 dark:bg-warning/30 p-6 rounded-xl shadow-sm border border-warning/20 dark:border-warning/30 hover:bg-warning/30 dark:hover:bg-warning/40 transition-colors">
                <div className="font-bold text-warning text-xl text-center mb-2">OBSERWUJ</div>
                <div className="text-sm text-warning text-center">
                  Monitoruj CPC
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="p-3 bg-card rounded-lg shadow-sm w-full">
                  <div className="font-bold text-destructive">Wysoki koszt</div>
                  <div className="text-sm text-destructive mt-1">&gt;{settings.maxCost} PLN</div>
                </div>
              </div>
              <div className="bg-warning/20 dark:bg-warning/30 p-6 rounded-xl shadow-sm border border-warning/20 dark:border-warning/30 hover:bg-warning/30 dark:hover:bg-warning/40 transition-colors">
                <div className="font-bold text-warning text-xl text-center mb-2">OBSERWUJ</div>
                <div className="text-sm text-warning text-center">
                  Monitoruj koszt
                </div>
              </div>
              <div className="bg-destructive/20 dark:bg-destructive/30 p-6 rounded-xl shadow-sm border border-destructive/20 dark:border-destructive/30 hover:bg-destructive/30 dark:hover:bg-destructive/40 transition-colors">
                <div className="font-bold text-destructive text-xl text-center mb-2">WYŁĄCZ</div>
                <div className="text-sm text-destructive text-center">
                  Za wysokie koszty
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};