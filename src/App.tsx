import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonitorCheck, Grid2X2, Download, Trash2 } from 'lucide-react';
import { ThemeProvider } from '@/lib/theme-provider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { CampaignMonitor } from '@/components/CampaignMonitor';
import { DecisionMatrix } from '@/components/DecisionMatrix';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <div className="min-h-screen bg-background">
        <header className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">MetaMonitor</h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="monitor" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="monitor" className="flex items-center gap-2">
                <MonitorCheck className="w-4 h-4" />
                Monitor Kampanii
              </TabsTrigger>
              <TabsTrigger value="matrix" className="flex items-center gap-2">
                <Grid2X2 className="w-4 h-4" />
                Matryca Decyzyjna
              </TabsTrigger>
            </TabsList>
            <TabsContent value="monitor">
              <CampaignMonitor />
            </TabsContent>
            <TabsContent value="matrix">
              <DecisionMatrix />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;