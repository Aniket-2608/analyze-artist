
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart: React.FC = () => {
  const { stores, skus, weeks, planningData, calculateDerivedValues } = useData();
  const [selectedStore, setSelectedStore] = useState<string | undefined>(
    stores.length > 0 ? stores[0].id : undefined
  );

  // Filter and prepare data for the selected store
  const chartData = useMemo(() => {
    if (!selectedStore) return [];
    
    // Group data by week
    const weekData: Record<string, { 
      weekId: string,
      gmDollars: number,
      gmPercentage: number 
    }> = {};
    
    // Initialize with all weeks
    weeks.forEach(week => {
      weekData[week.id] = {
        weekId: week.id,
        gmDollars: 0,
        gmPercentage: 0
      };
    });
    
    // Calculate totals for each week
    let storeTotalsByWeek: Record<string, { salesDollars: number, gmDollars: number }> = {};
    
    skus.forEach(sku => {
      weeks.forEach(week => {
        const calculated = calculateDerivedValues(selectedStore, sku.id, week.id);
        
        if (calculated) {
          if (!storeTotalsByWeek[week.id]) {
            storeTotalsByWeek[week.id] = { salesDollars: 0, gmDollars: 0 };
          }
          
          storeTotalsByWeek[week.id].salesDollars += calculated.salesDollars;
          storeTotalsByWeek[week.id].gmDollars += calculated.gmDollars;
        }
      });
    });
    
    // Calculate GM percentage
    Object.entries(storeTotalsByWeek).forEach(([weekId, totals]) => {
      if (weekData[weekId]) {
        weekData[weekId].gmDollars = totals.gmDollars;
        weekData[weekId].gmPercentage = totals.salesDollars > 0 
          ? (totals.gmDollars / totals.salesDollars) * 100 
          : 0;
      }
    });
    
    // Convert to array
    return Object.values(weekData);
  }, [selectedStore, skus, weeks, calculateDerivedValues]);

  // Find the selected store name
  const selectedStoreName = useMemo(() => {
    if (!selectedStore) return 'Select a Store';
    const store = stores.find(s => s.id === selectedStore);
    return store ? store.label : 'Unknown Store';
  }, [selectedStore, stores]);

  return (
    <div className="container mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Store Performance Chart</CardTitle>
              <CardDescription>
                GM Dollars and GM % by Week for selected store
              </CardDescription>
            </div>
            
            <div className="w-full md:w-64">
              <Select
                value={selectedStore}
                onValueChange={(value) => setSelectedStore(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {selectedStore ? (
            <div className="w-full h-[70vh]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="weekId" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0}
                    tick={{ fontSize: 12 }}
                    height={60}
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    stroke="#3b82f6" 
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                    label={{ value: 'GM Dollars', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#10b981" 
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                    label={{ value: 'GM %', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'GM Dollars') return [`$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name];
                      if (name === 'GM %') return [`${value.toFixed(1)}%`, name];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="gmDollars" 
                    name="GM Dollars" 
                    fill="#3b82f6" 
                    opacity={0.8} 
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="gmPercentage" 
                    name="GM %" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
              <p>Please select a store to view the chart</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Chart;
